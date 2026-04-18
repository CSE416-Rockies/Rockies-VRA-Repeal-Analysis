import os
import pickle
import pandas as pd
import geopandas as gpd

# ── Constants ────────────────────────────────────────────────────────────────

TOTAL_DISTRICTS   = 14
EFFECTIVE_THRESHOLD = 0.6

INPUT_DIR  = "../inputs"
OUTPUT_DIR = "../outputs/Georgia"


def make_output_dirs():
    for sub in ["winner", "minority_effective_score",
                "population_pct", "splits", "ensemble_summary"]:
        os.makedirs(os.path.join(OUTPUT_DIR, sub), exist_ok=True)


def load_data():
    print("Loading GeoDataFrame...")
    gdf = gpd.read_file(os.path.join(INPUT_DIR, "ga_seawulf.gpkg"))
    gdf = gdf.reset_index(drop=True)
    gdf = gdf[gdf.geometry.notnull() & gdf.is_valid]

    print("Loading pickle files...")
    with open("../outputs/ga_raceblind_5000.pkl", "rb") as f:
        raceblind_pickle = pickle.load(f)
    with open("../outputs/ga_vra_5000.pkl", "rb") as f:
        vra_pickle = pickle.load(f)

    preferred_candidate = pd.read_csv(
        os.path.join(INPUT_DIR, "ga_preferred_candidates.csv")
    )

    return gdf, raceblind_pickle, vra_pickle, preferred_candidate


# ── Step 1: Preprocessing — map node_idx → UNIQUE_ID ────────────────────────

def preprocess_plans(gdf, pickle_data):
    """Convert raw assignment dicts to DataFrames with UNIQUE_ID."""
    node_to_id = gdf["UNIQUE_ID"].to_dict()
    plans = []
    for plan in pickle_data:
        df = pd.DataFrame(plan.items(), columns=["node_id", "District"])
        df["UNIQUE_ID"] = df["node_id"].map(node_to_id)
        plans.append(df[["UNIQUE_ID", "District"]])
    return plans

"""Merge a plan DataFrame onto the GeoDataFrame and aggregate by district."""
def merge_plan(gdf, plan):
    gdf_plan = gdf.merge(plan, on="UNIQUE_ID")
    gdf_plan = gdf_plan.drop(columns=["District_x"])
    gdf_plan = gdf_plan.rename(columns={"District_y": "District"})
    return gdf_plan.groupby("District").sum(numeric_only=True).reset_index()


# ── SW-5: Election winners ────────────────────────────────────────────────────

def calc_election_winners(gdf, plans, label):
    """SW-5 — determine overall winner (Harris vs Trump) for each plan."""
    print(f"  [{label}] SW-5: Calculating election winners...")
    results = []
    for i, plan in enumerate(plans):
        district_stats = merge_plan(gdf, plan)
        harris = district_stats["Kamala D. Harris"].sum()
        trump  = district_stats["Donald J. Trump"].sum()
        results.append({
            "plan_id": i,
            "winner":  "Harris" if harris > trump else "Trump",
        })

    winner_df = pd.DataFrame(results)
    winner_cnt_df = (
        winner_df["winner"].value_counts()
        .sort_index()
        .reset_index()
        .rename(columns={"index": "winner", "winner": "count"})
    )
    # pandas ≥ 1.1 value_counts().reset_index() column names differ by version
    winner_cnt_df.columns = ["winner", "count"]
    return winner_df, winner_cnt_df


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


def calc_minority_effectiveness(gdf, plans, preferred_candidate, label):
    """SW-6 — minority effectiveness score per district per plan."""
    print(f"  [{label}] SW-6: Calculating minority effectiveness scores...")
    results = []
    scores  = []

    for i, plan in enumerate(plans):
        district_stats = merge_plan(gdf, plan)
        df = district_stats.merge(preferred_candidate, on="District", how="left")

        _, _, district_score = count_effective(df)
        black_eff, latino_eff = scale_score(df, district_score)

        black_over  = sum(v > EFFECTIVE_THRESHOLD for v in black_eff.values())
        latino_over = sum(v > EFFECTIVE_THRESHOLD for v in latino_eff.values())

        results.append({
            "plan_id": i,
            "black_over_threshold": black_over,
            "latino_over_threshold": latino_over,
        })
        scores.append({
            "plan_id": i,
            "black_scores":  black_eff,
            "latino_scores": latino_eff,
        })

    return pd.DataFrame(results), pd.DataFrame(scores)


# ── SW-7: Minority population percentage ─────────────────────────────────────

def calc_minority_population(gdf, plans, label):
    """SW-7 — minority population percentage per district per plan."""
    print(f"  [{label}] SW-7: Calculating minority population percentages...")
    pct_rows = []
    cnt_rows = []

    for i, plan in enumerate(plans):
        district_stats = merge_plan(gdf, plan)
        black_pct  = district_stats["Black_population"]  / district_stats["Total_population"]
        latino_pct = district_stats["Latino_population"] / district_stats["Total_population"]

        pct_rows.append({
            "plan_id":    i,
            "black_pct":  black_pct.tolist(),
            "latino_pct": latino_pct.tolist(),
        })
        cnt_rows.append({
            "plan_id":   i,
            "black_cnt": int((black_pct  > 0.5).sum()),
            "latino_cnt": int((latino_pct > 0.5).sum()),
        })

    return pd.DataFrame(pct_rows), pd.DataFrame(cnt_rows)


# ── SW-8: Republican/Democratic split ────────────────────────────────────────

def calc_splits(gdf, plans, label):
    """SW-8 — D/R split for each plan."""
    print(f"  [{label}] SW-8: Calculating R/D splits...")
    splits = []

    for i, plan in enumerate(plans):
        district_stats = merge_plan(gdf, plan)
        dem_wins = sum(
            1 for _, row in district_stats.iterrows()
            if row["Kamala D. Harris"] > row["Donald J. Trump"]
        )
        splits.append({
            "plan_id":    i,
            "democrat":   dem_wins,
            "republican": TOTAL_DISTRICTS - dem_wins,
        })

    splits_df    = pd.DataFrame(splits)
    democrat_cnt = (
        splits_df["democrat"].value_counts()
        .sort_index()
        .reset_index()
    )
    democrat_cnt.columns = ["democrat", "count"]
    return splits_df, democrat_cnt


# ── SW-10: Ensemble summary ───────────────────────────────────────────────────

def calc_ensemble_summary(splits_df, minority_results_df, pop_cnt_df, ensemble_label):
    """SW-10 — combine all measures into one summary table."""
    print(f"  [{ensemble_label}] SW-10: Building ensemble summary...")

    minority_df   = minority_results_df.copy()
    opportunity_df = pop_cnt_df.copy()

    minority_df["minority_effective"]      = (
        minority_df["black_over_threshold"] + minority_df["latino_over_threshold"]
    )
    opportunity_df["opportunity_districts"] = (
        opportunity_df["black_cnt"] + opportunity_df["latino_cnt"]
    )

    summary = (
        splits_df
        .merge(minority_df[["plan_id", "minority_effective"]], on="plan_id", how="inner")
        .merge(opportunity_df[["plan_id", "opportunity_districts"]], on="plan_id", how="inner")
    )
    summary["ensemble"] = ensemble_label
    print(f"    Summary shape: {summary.shape}")
    return summary


# ── Main ─────────────────────────────────────────────────────────────────────

def run_ensemble(label, gdf, plans, preferred_candidate):
    """Run all SW-5 through SW-10 calculations for one ensemble."""
    print(f"\n{'='*50}")
    print(f" Running analysis for: {label}")
    print(f"{'='*50}")

    prefix = "rb" if label == "raceblind" else "vra"

    # SW-5
    winner_df, winner_cnt_df = calc_election_winners(gdf, plans, label)
    winner_df.to_csv(    f"{OUTPUT_DIR}/winner/{prefix}_winner.csv",     index=False)
    winner_cnt_df.to_csv(f"{OUTPUT_DIR}/winner/{prefix}_winner_cnt.csv", index=False)

    # SW-6
    minority_results_df, minority_scores_df = calc_minority_effectiveness(
        gdf, plans, preferred_candidate, label
    )
    minority_results_df.to_csv(
        f"{OUTPUT_DIR}/minority_effective_score/ga_{prefix}_minority_effective_score_cnt.csv",
        index=False
    )
    minority_scores_df.to_csv(
        f"{OUTPUT_DIR}/minority_effective_score/ga_{prefix}_minority_effective_scores.csv",
        index=False
    )

    # SW-7
    pop_pct_df, pop_cnt_df = calc_minority_population(gdf, plans, label)
    pop_pct_df.to_csv(f"{OUTPUT_DIR}/population_pct/ga_{prefix}_pop_pct.csv", index=False)
    pop_cnt_df.to_csv(f"{OUTPUT_DIR}/population_pct/ga_{prefix}_pop_cnt.csv", index=False)

    # SW-8
    splits_df, democrat_cnt_df = calc_splits(gdf, plans, label)
    splits_df.to_csv(      f"{OUTPUT_DIR}/splits/{prefix}_splits.csv",        index=False)
    democrat_cnt_df.to_csv(f"{OUTPUT_DIR}/splits/{prefix}_democrat_wins.csv", index=False)

    # SW-10
    summary_df = calc_ensemble_summary(splits_df, minority_results_df, pop_cnt_df, label)
    summary_df.to_csv(f"{OUTPUT_DIR}/ensemble_summary/{prefix}_summary.csv", index=False)

    return summary_df


def main():
    make_output_dirs()
    gdf, raceblind_pickle, vra_pickle, preferred_candidate = load_data()

    print("Preprocessing plans...")
    raceblind_plans = preprocess_plans(gdf, raceblind_pickle)
    vra_plans = preprocess_plans(gdf, vra_pickle)

    rb_summary = run_ensemble("raceblind", gdf, raceblind_plans, preferred_candidate)
    vra_summary = run_ensemble("vra",       gdf, vra_plans,       preferred_candidate)

    print("\n\nAll done. Output files written to:", OUTPUT_DIR)
    print(f"  Raceblind plans analysed: {len(rb_summary)}")
    print(f"  VRA plans analysed:       {len(vra_summary)}")


if __name__ == "__main__":
    main()