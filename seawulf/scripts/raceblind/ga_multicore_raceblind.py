from gerrychain import Graph, constraints, Partition, MarkovChain, updaters, accept
import pickle
from gerrychain.proposals import recom
from gerrychain.tree import bipartition_tree
from gerrychain.constraints import contiguous
import networkx as nx
from functools import partial
import geopandas as gpd
import multiprocessing as mp
import sys
import os

def run_chain(core_id, steps, output_dir):
    print(f"Core {core_id} starting...")
    
    gdf = gpd.read_file("../../inputs/ga_seawulf.gpkg")
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
        total_steps=steps
    )

    district_plans = []

    for i, plan in enumerate(recom_chain):
        district_plans.append(plan.assignment)
    
    output_path = os.path.join(output_dir, f"ga_core_{core_id}.pkl")
    with open(output_path, "wb") as f:
        pickle.dump(district_plans, f)

    print(f"Core {core_id} done: saved {len(district_plans)} plans")

if __name__ == "__main__":
    num_cores = 8 
    # Adding one liner for 250 plan test script instead of new script
    mode = sys.argv[1] if len(sys.argv) > 1 else "large"
    total_plans = 250 if mode == "test" else 5000

    plans_per_core = total_plans // num_cores
    output_dir = "../outputs"
    os.makedirs(output_dir, exist_ok=True)

    processes = []

    for core_id in range(num_cores):
        p = mp.Process(
            target=run_chain,
            args=(core_id, plans_per_core, output_dir)
        )
        p.start()
        processes.append(p)

    for p in processes:
        p.join()

    print("All cores finished!")