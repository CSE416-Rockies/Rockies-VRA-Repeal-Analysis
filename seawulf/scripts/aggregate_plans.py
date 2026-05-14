import os
import glob
import json
import argparse
import pandas as pd


# CONSTATNS
OUTPUT_DIR = "../outputs/"
TOTAL_DISTRICTS = 14
demographics = ['white', 'black', 'latino', 'other']

#FUNCTIONS
def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", required=True, choices=["ga", "ar"])
    parser.add_argument("--mode", required=True, choices=["raceblind", "vra"])
    parser.add_argument("--total-plans", required=True, type=int)
    parser.add_argument("--plans", required=True, type=int)
    return parser.parse_args()

def read_jsonl(fpath):
    plans = []
    with open(fpath, "r") as f:
        for line in f:
            plans.append(json.loads(line))
    return plans

def calc_ensemble_summary(all_plans, mode):
    summary_df = pd.DataFrame([{
        "plan_id": p["plan_id"],
        "democrat_wins": p["democrat_wins"],
        "republican_wins": p["republican_wins"],
        "minority_effective": p["black_effective_score_cnt"] + p["latino_effective_score_cnt"],
        "opportunity_districts": len(p["black_majority_districts"]) + len(p["latino_majority_districts"]),
        "ensemble": mode,
    } for p in all_plans])
    
    print(f"Summary shape: {summary_df.shape}")
    return summary_df

def load_enacted_plan(state, demographics):
    with open(f"../inputs/{state}-enacted-shares.json") as f:
        enacted_plan = json.load(f)
    enacted_plan_demo = {}
    for demo in demographics:
        shares = enacted_plan[demo]["share"]
        df = pd.DataFrame({"enacted": shares})
        df["districtIndex"] = range(1, len(df) + 1)
        enacted_plan_demo[demo] = df
    return enacted_plan_demo

def combine_bins(state_dir, total_plans, demographics, total_districts):
    combined_bins = {
        demo: [[] for _ in range(total_districts)]
        for demo in demographics
    }
    
    bin_files = sorted(glob.glob(os.path.join(state_dir, f"bins_core_{total_plans}_*.json")))
    print(f"Found {len(bin_files)} bin files")
    
    for fpath in bin_files:
        with open(fpath) as f:
            core_bins = json.load(f)
        for demo in demographics:
            for i in range(total_districts):
                combined_bins[demo][i].extend(core_bins[demo][i])
    
    return combined_bins

def calculate_boxwhisker(combined_bins, demographics, enacted_plan_demo):
    summaries = {}
    for demo in demographics:
        summary = []
        for i, values in enumerate(combined_bins[demo]):
            s = pd.Series(values)
            summary.append({
                "districtIndex": i + 1,
                "min": s.min(),
                "q1": s.quantile(0.25),
                "median": s.quantile(0.5),
                "q3": s.quantile(0.75),
                "max": s.max(),
                "enacted": enacted_plan_demo[demo].loc[
                    enacted_plan_demo[demo]["districtIndex"] == i + 1, "enacted"
                ].values[0]
            })
        summaries[demo] = summary
        
    return summaries

def create_json(state, mode, summary, demographics):
    data = {'state': state}
    ensemble = {}
    for demo in demographics:
        ensemble[demo] = summary[demo]
    data[mode] = ensemble
    return data

def main():
    args = parse_args()
    state = args.state
    mode = args.mode
    state_full_name = 'Georgia' if state == 'ga' else "Arkansas"

    TOTAL_DISTRICTS = 4 if state == 'ar' else 14
        
    total_plans = args.total_plans
    state_dir = os.path.join(OUTPUT_DIR, state_full_name, mode, str(total_plans))
    plans_per_core = args.plans
    
    
    pattern = os.path.join(state_dir, f"{state}_{mode}_{plans_per_core}_core_*.jsonl")
    core_files = sorted(glob.glob(pattern))
        
    if not core_files:
        print(f"No files found matching {pattern}")
        return

    print(f"Found {len(core_files)} core files")

    # combine all plans
    all_plans = []
    for fpath in core_files:
        plans = read_jsonl(fpath)
        print(f"{os.path.basename(fpath)}: {len(plans)} plans")
        all_plans.extend(plans)
        
    for i, plan in enumerate(all_plans):
        plan["plan_id"] = i

    print(f"Total plans: {len(all_plans)}")

    # save final output
    out_path = os.path.join(OUTPUT_DIR, state_full_name, f"{state}_{mode}_{len(all_plans)}.jsonl")
    with open(out_path, "w") as f:
        for plan in all_plans:
            f.write(json.dumps(plan) + "\n")

    print(f"Saved to {out_path}")
    
    # SW-10
    summary_df = calc_ensemble_summary(all_plans, mode)
    summary_df.to_csv(os.path.join(OUTPUT_DIR, state_full_name, f"{state}_{mode}_{total_plans}_summary.csv"), index=False)
    
    #SW-11
    combined_bins = combine_bins(state_dir, total_plans, demographics, TOTAL_DISTRICTS)
    enacted_plan_demo = load_enacted_plan(state, demographics)
    box_whisker = calculate_boxwhisker(combined_bins, demographics, enacted_plan_demo)
    box_whisker_data = create_json(state_full_name, mode, box_whisker, demographics)
    with open(os.path.join(OUTPUT_DIR, state_full_name, f"{state}_{mode}_{total_plans}_box_whisker.json"), "w") as f:
        json.dump(box_whisker_data, f, indent=2)

if __name__ == "__main__":
    main()