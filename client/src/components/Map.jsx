import { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {US_BOUNDS, STATE_BOUNDS, STATE_OPTIONS} from "../utils/constants";
import { highlightStateStyle } from "../utils/mapStyles";

import GlobalStoreContext from "../store";

export default function Map() {
  const { setSelectedState } = useContext(GlobalStoreContext);
  const [stateLines, setStateLines] = useState(null);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  const isStateOption = (name) => STATE_OPTIONS.some(s => s.id === name);
  
  /* US State Lines Style */
  const lineStyle = (feature) => {
    if (isStateOption(feature.properties.NAME)) {
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

  // bring the state lines to front
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer((layer) => {
      const name = layer.feature?.properties?.NAME;
      if (isStateOption(name)) {
        layer.bringToFront();
      }
    });
  }, [stateLines]);

  const onEachState = (feature, layer) => {
    if (isStateOption(feature.properties.NAME)) {
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
          e.target.setStyle(highlightStateStyle);
        },
        mouseout: (e) => {
          e.target.setStyle(lineStyle(feature));
        },
        click: (e) => {
          const stateName = feature.properties.NAME;
          const bounds = STATE_BOUNDS[stateName];
          setSelectedState(stateName);

          e.target.setStyle(lineStyle(feature));

          if (bounds) {
            const map = e.target._map;
            console.log("doing zooming effect");
            map.flyToBounds(bounds, {
              duration: 1,
            });

            setTimeout(() => {
              navigate(`/map/${stateName}`);
            }, 200);
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
    <div className = 'relative h-screen w-screen'>
      <MapContainer
        bounds={US_BOUNDS}
        className="fixed inset-0 h-screen w-full"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {stateLines && <GeoJSON ref = {geoJsonRef} data={stateLines} style={lineStyle} onEachFeature={onEachState}/>}
      </MapContainer>
      <div className='absolute bottom-5 left-5 z-[1000]  bg-white rounded-lg px-10 py-5 shadow-md'>
        <div className = 'font-semibold text-3xl text-gray-600'>VRA Repeal Analysis </div>
        <div className = 'flex items-center text-xl text-gray-500'>
            <div>Rockies 2026</div>
        </div>
      </div>
    </div>
  );
}