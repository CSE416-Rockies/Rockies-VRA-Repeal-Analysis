from gerrychain import Graph, constraints, Partition, MarkovChain, updaters, accept
import pickle
from gerrychain.proposals import recom
from gerrychain.tree import bipartition_tree
from gerrychain.constraints import contiguous
import networkx as nx
from functools import partial
import pandas as pd


import geopandas as gpd

gdf = gpd.read_file("../inputs/ga_seawulf.gpkg")
gdf = gdf.reset_index(drop=True)
gdf = gdf[gdf.geometry.notnull() & gdf.is_valid]

prefer = pd.read_csv("../inputs/ga_preferred_candidates.csv")


graph = Graph.from_geodataframe(
    gdf,
    adjacency='queen'
)

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
    node_repeats=100,
    method = partial(
        bipartition_tree,
        max_attempts=100,
        allow_pair_reselection=True
    )
)

# constraints 1

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

# Benchmark from enacted plan
benchmark_splits = count_county_splits(initial_partition)

# Hard cap at some multiple of the benchmark
county_constraint = constraints.UpperBound(
    lambda p: count_county_splits(p),
    2 * benchmark_splits  # adjust multiplier as needed
)

# compactness constraints
compactness_bound = constraints.UpperBound(
    lambda p: len(p["cut_edges"]),
    2 * len(initial_partition["cut_edges"])
)

# VRA Constraints - effective district calculation
THRESHOLD = 0.6
MINORITY_RACES = ['Black']
prefer_lookup = prefer.set_index("District").to_dict(orient="index")

def count_minority_effective_districts(partition):
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

        if min(district_score, 1.0) > THRESHOLD:
            effective_count += 1

    return effective_count

benchmark_effective = count_minority_effective_districts(initial_partition)
print(f"Benchmark effective minority districts: {benchmark_effective}")

minority_constraint = constraints.LowerBound(
    lambda p: count_minority_effective_districts(p),
    benchmark_effective
)

#recom chain
recom_chain = MarkovChain(
    proposal=proposal,
    constraints=[contiguous, compactness_bound, county_constraint, minority_constraint],
    accept=accept.always_accept,
    initial_state=initial_partition,
    total_steps=250
)

district_plans = []

for i, plan in enumerate(recom_chain):
    if len(district_plans) >= 250:
        break
    length = len(district_plans)
    if length %100 == 0:
        print(f"finished generating {length} plans. \n")
    
    district_plans.append(plan.assignment)
        
with open("../outputs/ga_vra_250_local.pkl", "wb") as f:
    pickle.dump(district_plans, f)

print("Done: saved VRA 250 plans")