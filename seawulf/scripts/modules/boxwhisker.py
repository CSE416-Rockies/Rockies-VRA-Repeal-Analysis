import geopandas as gpd
import pandas as pd
import pickle
import json

"""Load Ensembles and Load Plans as DataFrame into Ensemble List"""
gdf = gpd.read_file('../../inputs/ga_seawulf.gpkg')
with open('../../outputs/ga_raceblind_5000.pkl', 'rb') as file:
    raceblind_pickle = pickle.load(file)
with open('../../outputs/ga_vra_5000.pkl', 'rb') as file:
    vra_pickle = pickle.load(file)

node_to_id = gdf['UNIQUE_ID'].to_dict()

vra_plans = []
for plan in vra_pickle:
    df = pd.DataFrame(plan.items(), columns=['node_id', 'District'])
    df['UNIQUE_ID'] = df['node_id'].map(node_to_id)
    df = df[['UNIQUE_ID', 'District']]
    vra_plans.append(df)

raceblind_plans = []
for plan in raceblind_pickle:
    df = pd.DataFrame(plan.items(), columns=['node_id', 'District'])
    df['UNIQUE_ID'] = df['node_id'].map(node_to_id)
    df = df[['UNIQUE_ID', 'District']]
    raceblind_plans.append(df)

print('Finished loading ensembles...')

"""Load Enacted Plan Points and store them into a dict of dataframes"""
# Access white enacted_plan demographic points like this: enacted_plan_demo['white']
with open('../../inputs/ga-enacted-shares.json') as json_file:
    enacted_plan = json.load(json_file)

enacted_plan_demo = {}
demographics = ['white', 'black', 'latino', 'other']

for demo in demographics:
    shares = enacted_plan[demo]["share"]

    df = pd.DataFrame({
        "enacted": shares
    })
    df["districtIndex"] = range(1, len(df) + 1)

    enacted_plan_demo[demo] = df

print('Finished loading enacted plan points...')

"""Calculate Box-Whisker Data"""

def calculate_pop_shares(plans, gdf):
    drop_cols = [
        'Kamala D. Harris', 'Donald J. Trump', 'Other_candidates',
        'Total_votes', 'White_population', 'Black_population',
        'Latino_population', 'Other_population', 'Total_population'
    ]

    pop_shares = []
    for i, plan in enumerate(plans):
        gdf_plan = (
            gdf.merge(plan, on="UNIQUE_ID")
               .drop(columns=['District_x'])
               .rename(columns={'District_y': 'District'})
        )

        district_stats = (
            gdf_plan.groupby("District")
            .sum(numeric_only=True)
            .assign(
                white_share=lambda df: df['White_population']  / df['Total_population'],
                black_share=lambda df: df['Black_population']  / df['Total_population'],
                latino_share=lambda df: df['Latino_population'] / df['Total_population'],
                other_share=lambda df: df['Other_population']  / df['Total_population'],
            )
            .drop(columns=drop_cols)
            .reset_index()
        )

        pop_shares.append(district_stats)

    return pop_shares

def calculate_boxwhisker(plans, gdf, demographics, enacted_plan_demo):
    pop_shares = calculate_pop_shares(plans, gdf)
    summaries = {}

    for demo in demographics:
        sorted_plans = []
        for df in pop_shares:
            df_sorted = (
                df.sort_values(f"{demo}_share")
                  .reset_index(drop=True)
                  .drop(columns='District')
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

vra_summaries = calculate_boxwhisker(vra_plans, gdf, demographics, enacted_plan_demo)
raceblind_summaries = calculate_boxwhisker(raceblind_plans, gdf, demographics, enacted_plan_demo)

print('Finished calculating summaries...')

"""Merge Back into JSON"""
def create_json(vra_summaries, raceblind_summaries, demographics):
    data = {'state': 'Georgia'}

    vra = {}
    raceblind = {}

    for demo in demographics:
        vra[demo] = vra_summaries[demo].to_dict(orient="records")
        raceblind[demo] = raceblind_summaries[demo].to_dict(orient="records")

    data['vra'] = vra
    data['raceBlind'] = raceblind

    return data

data = create_json(vra_summaries, raceblind_summaries, demographics)

print('Finished merging...')

with open("../../outputs/ga-box-whisker.json", "w") as f:
    json.dump(data, f, indent=2)

print('Done!\n')