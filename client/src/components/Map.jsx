import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [stateLines, setStateLines] = useState(null);
  const navigate = useNavigate();

  const usBounds = [
    [24.396308, -124.848974],
    [49.384358, -66.885444]   
  ];

  const stateBounds = {
    Delaware: [
      [38.451, -75.789],
      [39.839, -75.048],
    ],
    Georgia: [
      [30.357, -85.605],
      [35.000, -80.751],
    ],
  };
  
  /* US State Lines Style */
  const lineStyle = (feature) => {
    if (feature.properties.NAME === "Delaware" || feature.properties.NAME === "Georgia") {
      return {
        fillColor: "#d8d8d8", 
        color: "#6b7280",     
        weight: 2,
        fillOpacity: 1,
      };
    }

    return {
      fillOpacity: 0,
      weight: 1,
      color: "#cccccc",
    };
  };

  const highlightStyle = {
    fillColor: "#D3E6DC", 
    color: "#10B981",     
    weight: 2,
    fillOpacity: 1,
  }

  const onEachState = (feature, layer) => {
    if (feature.properties.NAME === "Delaware" || feature.properties.NAME === "Georgia") {
      layer.bindTooltip(
        `<div class="px-3 py-2 rounded-xl bg-white shadow-lg text-sm font-medium text-gray-800">
          <strong>${feature.properties.NAME}</strong><br/>
          Click to explore
        </div>`,
      {
        permanent: false,
        sticky: true,
        direction: "top",
      });

      layer.on({
        mouseover: (e) => {
          e.target.setStyle(highlightStyle);
        },
        mouseout: (e) => {
          e.target.setStyle(lineStyle(feature));
        },
        click: (e) => {
          const stateName = feature.properties.NAME;
          const bounds = stateBounds[stateName];
          e.target.setStyle({
            fillOpacity: 0,
            weight: 1,
            color: "#cccccc",
          });

          if (bounds) {
            const map = e.target._map;

            map.flyToBounds(bounds, {
              duration: 1,
            });

            setTimeout(() => {
              navigate(`/map/${stateName}`);
            }, 1000);
          }
        },
      });
    }
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

      {stateLines && <GeoJSON data={stateLines} style={lineStyle} onEachFeature={onEachState}/>}
    </MapContainer>
  );
}