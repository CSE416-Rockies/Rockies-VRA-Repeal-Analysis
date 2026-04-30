import os
import json
import argparse
from functools import partial
 
import pandas as pd
import geopandas as gpd
from gerrychain import Graph, Partition, MarkovChain, updaters, accept, constraints
from gerrychain.proposals import recom
from gerrychain.tree import bipartition_tree
from gerrychain.constraints import contiguous

# CONSTANTS ---------------------------------------------------------------------------------------------------------
MINORITY_RACES = ['Black']
OUTPUT_DIR = "../outputs/"
TOTAL_DISTRICT = 14
EFFECTIVE_THRESHOLD = 0.6
demographics = ['white', 'black', 'latino', 'other']

# ARG PARSER ---------------------------------------------------------------------------------------------------------
def parse_arg():
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", required=True, choices=["ga", "ar"])
    parser.add_argument("--mode", required=True, choices=["raceblind", "vra"])
    parser.add_argument("--plans", type=int, required=True)
    parser.add_argument("--total-plans", type=int, required=True)
    parser.add_argument("--core-id", type=int, required=True)
    return parser.parse_args()


# FILE LOADER ---------------------------------------------------------------------------------------------------------
def load_file(path):
    gdf = gpd.read_file(path)
    gdf = gdf.reset_index(drop=True)
    gdf = gdf[gdf.geometry.notnull() & gdf.is_valid]
    return gdf

# CONSTRAINTS HELPERS --------------------------------------------------------------------------------------------------------
def count_minority_effective_districts(partition, prefer_lookup):
    district_totals = {}
    for node, district_id in partition.assignment.items():
        if district_id not in district_totals:
            district_totals[district_id] = {"harris": 0.0, "trump": 0.0, "total_pop": 0.0, "Black_population": 0.0, "Latino_population": 0.0}
        node_attrs = partition.graph.nodes[node]
        district_totals[district_id]["harris"] += node_attrs["Kamala D. Harris"]
        district_totals[district_id]["trump"] += node_attrs["Donald J. Trump"]
        district_totals[district_id]["total_pop"] += node_attrs["Total_population"]
        district_totals[district_id]["Black_population"] += node_attrs["Black_population"]
        district_totals[district_id]["Latino_population"] += node_attrs["Latino_population"]

    effective_count = 0

    for district_id, totals in district_totals.items():
        harris_won = totals["harris"] > totals["trump"]
        pref = prefer_lookup.get(district_id, {})
        total_pop = totals["total_pop"] or 1

        district_score = 0.0
        for race in MINORITY_RACES:
            preferred = pref.get(race)
            preferred_won = (preferred == "Harris" and harris_won) or (preferred == "Trump"  and not harris_won)
            if preferred_won:
                k = totals[f"{race}_population"] / total_pop
                district_score += min(2 * k, 1.0)

        if min(district_score, 1.0) > EFFECTIVE_THRESHOLD:
            effective_count += 1

    return effective_count

def count_county_splits(partition):
    county_assignments = {}
    for node, district in partition.assignment.items():
        county = partition.graph.nodes[node]["COUNTYFP"]
        if county not in county_assignments:
            county_assignments[county] = set()
        county_assignments[county].add(district)
    
    # A county is split if it appears in more than one district
    splits = sum(1 for districts in county_assignments.values() if len(districts) > 1)
    return splits

# CHAIN BUILDING --------------------------------------------------------------------------------------------------------
def build_chain(gdf, mode, prefer_df):
    graph = Graph.from_geodataframe(gdf, adjacency='queen')
    my_updaters = {
        "population": updaters.Tally("Total_population", alias='population'),
        "cut_edges": updaters.cut_edges
    }

    initial_partition = Partition(
        graph,
        assignment="District",
        updaters=my_updaters
    )
    
    ideal_population = sum(initial_partition["population"].values()) / len(initial_partition)
    
    proposal = partial(
        recom,
        pop_col="Total_population",
        pop_target=ideal_population,
        epsilon=0.1,
        node_repeats=1,
        method = partial(
            bipartition_tree,
            max_attempts=100,
            allow_pair_reselection=True
        )
    )
    
    # Benchmark from enacted plan
    benchmark_splits = count_county_splits(initial_partition)
    
    compactness_bound = constraints.UpperBound(
        lambda p: len(p["cut_edges"]),
        2 * len(initial_partition["cut_edges"])
    )

    county_constraint = constraints.UpperBound(
        lambda p: count_county_splits(p),
        2 * benchmark_splits  # adjust multiplier as needed
    )

    chain_constriants = [
        contiguous,
        compactness_bound,
        county_constraint,
    ]
    # VRA Constraints - effective district calculation
    if mode == 'vra':
        prefer_lookup = prefer_df.set_index("District").to_dict(orient="index")
        benchmark_effective = count_minority_effective_districts(initial_partition, prefer_lookup)
        print(f"Benchmark effective minority districts: {benchmark_effective}")
        minority_constraint = constraints.LowerBound(
            lambda p: count_minority_effective_districts(p, prefer_lookup),
            benchmark_effective
        )
        chain_constriants.append(minority_constraint)
        
    #recom chain
    recom_chain = MarkovChain(
        proposal=proposal,
        constraints= chain_constriants,
        accept=accept.always_accept,
        initial_state=initial_partition,
        total_steps=999_999
    )
    
    return recom_chain
        
# ANALYSIS FUNCTION --------------------------------------------------------------------------------------------------------

def merge_plan(gdf, plan):
    gdf_plan = gdf.merge(plan, on="UNIQUE_ID")
    gdf_plan = gdf_plan.drop(columns=["District_x"])
    gdf_plan = gdf_plan.rename(columns={"District_y": "District"})
    return gdf_plan.groupby("District").sum(numeric_only=True).reset_index()

# ── SW-5: Election winners ────────────────────────────────────────────────────

def calc_election_winners(district_stats):
    harris = district_stats["Kamala D. Harris"].sum()
    trump  = district_stats["Donald J. Trump"].sum()
    return "Harris" if harris > trump else "Trump"

# ── SW-6: Minority effectiveness score ───────────────────────────────────────

def count_effective(df):
    black_effective = 0
    latino_effective = 0
    district_score = {}

    for _, row in df.iterrows():
        district_id = row["District"]
        harris_won  = row["Kamala D. Harris"] > row["Donald J. Trump"]

        latino_ok = (
            (row["Latino"] == "Harris" and harris_won) or
            (row["Latino"] == "Trump"  and not harris_won)
        )
        black_ok = (
            (row["Black"] == "Harris" and harris_won) or
            (row["Black"] == "Trump"  and not harris_won)
        )

        if latino_ok:
            latino_effective += 1
        if black_ok:
            black_effective += 1

        district_score[district_id] = int(latino_ok or black_ok)

    return black_effective, latino_effective, district_score


def scale_score(df, district_score):
    black_eff  = {}
    latino_eff = {}
    for _, row in df.iterrows():
        district_id = row["District"]
        total  = row["Total_population"]
        black  = row["Black_population"]
        latino = row["Latino_population"]
        raw = district_score[district_id]
        black_eff[district_id]  = min(black  / total * 2, raw)
        latino_eff[district_id] = min(latino / total * 2, raw)
    return black_eff, latino_eff


def calc_minority_effectiveness(district_stats, preferred_candidate):
    preferred_candidate['District'] = preferred_candidate["District"].astype(str)
    district_stats['District'] = district_stats['District'].astype(str)
    df = district_stats.merge(preferred_candidate, on="District", how="left")

    _, _, district_score = count_effective(df)
    black_eff, latino_eff = scale_score(df, district_score)

    black_over  = sum(v > EFFECTIVE_THRESHOLD for v in black_eff.values())
    latino_over = sum(v > EFFECTIVE_THRESHOLD for v in latino_eff.values())

    return black_over, black_eff, latino_over, latino_eff


# ── SW-7: Minority population percentage ─────────────────────────────────────

def calc_minority_population(district_stats):
    black_pct  = district_stats["Black_population"]  / district_stats["Total_population"]
    latino_pct = district_stats["Latino_population"] / district_stats["Total_population"]
    black_cnt = int((black_pct  > 0.5).sum())
    latino_cnt = int((latino_pct > 0.5).sum())

    return black_pct, black_cnt, latino_pct, latino_cnt


# ── SW-8: Republican/Democratic split ────────────────────────────────────────

def calc_splits(district_stats, total_district):
    dem_wins = sum(
        1 for _, row in district_stats.iterrows()
        if row["Kamala D. Harris"] > row["Donald J. Trump"]
    )
    
    return dem_wins, total_district - dem_wins


# MAIN FUNCTION  ────────────────────────────────────────────────────-────────────────────────────────────────────────────
def main():
    args = parse_arg()
    core_id = args.core_id
    state = args.state
    state_full_name = 'Georgia' if state == 'ga' else "Arkansas"
    total_plans = args.total_plans
    plans_per_core = args.plans
    mode = args.mode
    state_dir = os.path.join(OUTPUT_DIR, state_full_name, mode, str(total_plans))
    if state == 'ar':
        TOTAL_DISTRICT = 4
        
    bins = {
        demo: [[] for _ in range(TOTAL_DISTRICT)] for demo in demographics
    }
    
    
    print(f"Core {core_id} | state={state} | mode={mode} | plans={plans_per_core}")

    
    gdf = load_file(f"../inputs/{state}_seawulf.gpkg")
    prefer = pd.read_csv(f"../inputs/{state}_preferred_candidates.csv")
    chain = build_chain(gdf, mode, prefer)
    
    os.makedirs(state_dir, exist_ok=True)
    out_path = os.path.join(state_dir, f"{state}_{mode}_{plans_per_core}_core_{core_id:03d}.jsonl")
    
    if state == 'ar':
        gdf = gdf.rename(columns={'Unique_ID': 'UNIQUE_ID'})
    node_to_id = gdf["UNIQUE_ID"].to_dict()
    
        
    plan_count = 0
    with open(out_path, "a") as f:
        for plan in chain:
            assignment = dict(plan.assignment)
            plan_df = pd.DataFrame(assignment.items(), columns=["node_id", "District"])
            plan_df["UNIQUE_ID"] = plan_df["node_id"].map(node_to_id)
            plan_df = plan_df[["UNIQUE_ID", "District"]]
            district_stats = merge_plan(gdf, plan_df)
            
            # run analysis on this single plan
            winner = calc_election_winners(district_stats)
            dem_wins, rep_wins = calc_splits(district_stats, TOTAL_DISTRICT)
            
            black_over, black_eff, latino_over, latino_eff = calc_minority_effectiveness(district_stats, prefer)
            black_effective_districts = [str(d) for d, v in black_eff.items() if v > EFFECTIVE_THRESHOLD]
            latino_effective_districts = [str(d) for d, v in latino_eff.items() if v > EFFECTIVE_THRESHOLD]
            
            black_pct, black_cnt, latino_pct, latino_cnt = calc_minority_population(district_stats)
            black_majority_districts = district_stats.loc[
                district_stats["Black_population"] / district_stats["Total_population"] > 0.5, "District"
            ].astype(str).tolist()
            latino_majority_districts = district_stats.loc[
                district_stats["Latino_population"] / district_stats["Total_population"] > 0.5, "District"
            ].astype(str).tolist()

            result = {
                #SW-5
                "winner": winner, 

                #SW-6
                "black_effective_score_cnt": black_over,
                "black_effective_score_districts": black_effective_districts,
                "latino_effective_score_cnt": latino_over,
                "latino_effective_score_districts": latino_effective_districts,
                "black_effective_scores": {str(k): v for k, v in black_eff.items()},
                "latino_effective_scores": {str(k): v for k, v in latino_eff.items()},
                
                #SW-7
                "black_population_pct": black_pct.tolist(),
                "latino_population_pct": latino_pct.tolist(),
                "black_majority_districts": black_majority_districts,
                "latino_majority_districts": latino_majority_districts,
                
                #SW-8
                "republican_wins": rep_wins, 
                "democrat_wins": dem_wins,
                
                # Box and Whisker
                "white_share": (district_stats["White_population"] / district_stats["Total_population"]).tolist(),
                "black_share": (district_stats["Black_population"] / district_stats["Total_population"]).tolist(),
                "latino_share": (district_stats["Latino_population"] / district_stats["Total_population"]).tolist(),
                "other_share": (district_stats["Other_population"] / district_stats["Total_population"]).tolist(),
                
                # "assignment": {str(k): v for k, v in assignment.items()},
            }
            
            f.write(json.dumps(result) + "\n")
            f.flush()
            
            for demo in demographics:
                shares = (district_stats[f"{demo.capitalize()}_population"] / 
                        district_stats["Total_population"]).sort_values().tolist()
                for i, share in enumerate(shares):
                    bins[demo][i].append(share)
            
            plan_count += 1
            if plan_count % 10 == 0:
                print(f"Core {core_id}: {plan_count}/{plans_per_core} plans", flush=True)
            if plan_count >= plans_per_core:
                break
    
    print(f"Core {core_id}: done — saved {plan_count} plans to {out_path}")
    
    bins_path = os.path.join(state_dir, f"bins_core_{total_plans}_{core_id:03d}.json")
    with open(bins_path, "w") as f:
        json.dump(bins, f)
    print(f"Core {core_id}: saved bins to {bins_path}")
    
if __name__ == "__main__":
    main()