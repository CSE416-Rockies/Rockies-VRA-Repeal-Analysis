import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [stateLines, setStateLines] = useState(null);
  const usBounds = [
    [24.396308, -124.848974],
    [49.384358, -66.885444]   
  ];
  
  /* US State Lines Style */
  const lineStyle = {
    fillOpacity: 0,
    weight: 1,
    color: "#cccccc",
  };

  useEffect(() => {
    fetch("/geojson/2024_us_state_lines.json")
      .then((res) => res.json())
      .then((data) => setStateLines(data))
      .catch((err) => console.error("Error loading geojson:", err));
  }, []);

  return (
    <MapContainer
      bounds={usBounds}
      className="fixed inset-0 h-screen w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {stateLines && <GeoJSON data={stateLines} style={lineStyle}/>}
    </MapContainer>
  );
}