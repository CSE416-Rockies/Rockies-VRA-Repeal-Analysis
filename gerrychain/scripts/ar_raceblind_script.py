from gerrychain import Graph, constraints, Partition, MarkovChain, updaters, accept
import pickle
from gerrychain.proposals import recom
from gerrychain.tree import bipartition_tree
from gerrychain.constraints import contiguous
import networkx as nx
from functools import partial


import geopandas as gpd

gdf = gpd.read_file("../inputs/ar_seawulf.gpkg")
gdf = gdf.reset_index(drop=True)
gdf = gdf[gdf.geometry.notnull() & gdf.is_valid]

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

compactness_bound = constraints.UpperBound(
    lambda p: len(p["cut_edges"]),
    2 * len(initial_partition["cut_edges"])
)

recom_chain = MarkovChain(
    proposal=proposal,
    constraints=[contiguous, compactness_bound, county_constraint],
    accept=accept.always_accept,
    initial_state=initial_partition,
    total_steps=300
)

district_plans = []

for i, plan in enumerate(recom_chain):
    if len(district_plans) >= 250:
        break
    
    district_plans.append(plan.assignment)
        
with open("../outputs/ga_250.pkl", "wb") as f:
    pickle.dump(district_plans, f)

print("Done: saved 250 plans")