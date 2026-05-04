import { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import GlobalStoreContext from "../store";

import {US_BOUNDS, STATE_BOUNDS, STATE_OPTIONS} from "../utils/constants";
import { highlightStateStyle } from "../utils/mapStyles";

import { getStateLines } from "../api/api.js";
import ErrorMsg from "./ErrorMsg.jsx";


function MapController({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

export default function Map() {
  const { store, setSelectedState } = useContext(GlobalStoreContext);
  const [stateLines, setStateLines] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  const isStateOption = (name) => STATE_OPTIONS.some(s => s.label === name);
  
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

  // navigate to state's mapview when using state dropdown
  useEffect( () => {
      const selectedState = store.selectedState;
      if(!selectedState) return;
      const bounds = STATE_BOUNDS[selectedState]
      if(!bounds || !mapRef.current) return;

      // zoom in 
      mapRef.current.flyToBounds(bounds, {  duration: 1, });
      setTimeout(() => {
        navigate(`/map/${selectedState}`);
      }, 200);
  }, [store.selectedState]);
  

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
          setSelectedState(feature.properties.NAME);
          e.target.setStyle(lineStyle(feature));
        },
      });
    }
  };

  useEffect(() => {
    getStateLines()
      .then((res) => setStateLines(res.data))
      .catch((err) => {
        console.error("Error loading geojson:", err);
        setError("Failed to load data.");
      });
}, []);

  

  return (
    <div className = 'relative h-screen w-screen'>
      <MapContainer
        bounds={US_BOUNDS}
        className="fixed inset-0 h-screen w-full"
      >
        <MapController mapRef = {mapRef}/>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {stateLines && <GeoJSON ref = {geoJsonRef} data={stateLines} style={lineStyle} onEachFeature={onEachState}/>}
      </MapContainer>
      <div className='absolute bottom-5 left-5 z-[1000]  bg-white rounded-lg px-10 py-5 shadow-md'>
        { error ? <ErrorMsg message={error}/>
        :
          <>
            <div className = 'font-semibold text-3xl text-gray-600'>VRA Repeal Analysis </div>
            <div className = 'flex items-center text-xl text-gray-500'>
                <div>Rockies 2026</div>
            </div>
          </>
        }
      </div>
    </div>
  );
}