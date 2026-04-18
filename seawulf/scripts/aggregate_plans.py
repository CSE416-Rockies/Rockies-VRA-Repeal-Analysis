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

def calculate_boxwhisker(all_plans, demographics, enacted_plan_demo):
    # rebuild pop_shares from pre-computed jsonl fields
    pop_shares = []
    for p in all_plans:
        df = pd.DataFrame({
            "white_share":  p["white_share"],
            "black_share":  p["black_share"],
            "latino_share": p["latino_share"],
            "other_share":  p["other_share"],
        })
        pop_shares.append(df)

    # rest stays exactly the same as before
    summaries = {}
    for demo in demographics:
        sorted_plans = []
        for df in pop_shares:
            df_sorted = (
                df.sort_values(f"{demo}_share")
                  .reset_index(drop=True)
                  .assign(districtIndex=lambda d: d.index + 1)
            )
            sorted_plans.append(df_sorted)

        all_plans_df = pd.concat(sorted_plans, ignore_index=True)

        summary = (
            all_plans_df.groupby("districtIndex")[f"{demo}_share"]
            .agg(
                min="min",
                q1=lambda x: x.quantile(0.25),
                median="median",
                q3=lambda x: x.quantile(0.75),
                max="max"
            )
            .reset_index()
            .merge(enacted_plan_demo[demo], on="districtIndex", how="left")
        )
        summaries[demo] = summary

    return summaries

def create_json(state, mode, summary, demographics):
    data = {'state': state}

    ensemble = {}

    for demo in demographics:
        ensemble[demo] = summary[demo].to_dict(orient="records")

    data[mode] = ensemble
    
    return data

def main():
    args = parse_args()
    state = args.state
    mode = args.mode
    state_full_name = 'Georgia' if state == 'ga' else "Arkansas"
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
    
    enacted_plan_demo = load_enacted_plan(state, demographics)
        
    box_whisker = calculate_boxwhisker(all_plans, demographics, enacted_plan_demo)
    box_whisker_data = create_json(state_full_name, mode, box_whisker, demographics)
    with open(os.path.join(OUTPUT_DIR, state_full_name, f"{state}-box-whisker.json"), "w") as f:
        json.dump(box_whisker_data, f, indent=2)

if __name__ == "__main__":
    main()