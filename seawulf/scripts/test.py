import geopandas as gpd
from gerrychain import Graph

# Load your actual file
gdf = gpd.read_file("inputs/ga_seawulf.gpkg")

# Check columns
print("GDF columns:", gdf.columns.tolist())
print("Shape:", gdf.shape)

# Build graph and check node attributes
graph = Graph.from_geodataframe(gdf, adjacency='queen')
sample_node = list(graph.nodes)[0]
print("\nNode attributes:", list(graph.nodes[sample_node].keys()))
print("\nSample node data:", dict(graph.nodes[sample_node]))