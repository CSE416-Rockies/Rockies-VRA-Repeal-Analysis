import { useState, useEffect, useContext, useRef } from "react"
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import GlobalStoreContext from "../store/index.jsx";
import StateDetail from './StateDetail.jsx';
import DistrictDetail from './DistrictDetail.jsx';
import MapSelect from './MapSelect.jsx';
import StateSelection from "./StateSelection.jsx";
import Heatmap_Legend from "./Heatmap_Legend.jsx";

import { useDistrictData } from "../hooks/useDistrictData.js";
import { usePrecinctData } from "../hooks/usePrecinctData.js";

import { normalizeParty, MAP_PARTY_COLORS, STATE_BOUNDS } from "../utils/constants.js";
import { choroplethStyle, highlightStyle, lineStyle } from "../utils/mapStyles.js";


const legend_items = [
    {label: "0-5%", color: "#ECFDF5"},
    {label: "5-10%", color: "#D1FAE5"},
    {label: "10-25%", color: "#6EE7B7"},
    {label: "25-50%", color: "#10B981"},
    {label: "50-75%", color: "#047857"},
    {label: "75-100%", color: "#063E2F"},
]

export default function MapView(){
    const { store } = useContext(GlobalStoreContext); 
    const { name } = useParams();

    const [expanded, setExpanded] = useState(true);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const hoveredLayerRef = useRef(null);
    const selectedDistrictRef = useRef(null);
    const geoJsonRef = useRef(null);

    const selectedState = store?.selectedState || "";
    const districtArr = store?.representatives || [];

    const { districtPlan } = useDistrictData(name);
    const { precinctData } = usePrecinctData(name, store.mapMode);

    const navigate = useNavigate();

    const zoomOut = () =>{
        navigate(`/`);
    };

    const isLoading =   (store.mapMode === 'district' && !districtPlan) || 
                        (store.mapMode === 'precinct' && !precinctData);

    const getStyle = (feature) => store.minorityGroup ? choroplethStyle(feature, store.minorityGroup) : lineStyle(feature);
    const selectDistrict = (val) => {
        selectedDistrictRef.current = val ? String(val) : null;
        setSelectedDistrict(val);
    };

    const districtStyle = (feature) => {
        const mapDistrictValue = feature.properties.DISTRICT === "Congressional District (at Large)" // account for delaware
        ?   "0"
        :   String(feature.properties.DISTRICT).replace(/\D/g, "");

        // district's color
        let partyColor = MAP_PARTY_COLORS.other;
        const district = districtArr.find(
            (rep) => String(rep.districtNumber) === mapDistrictValue
        );
        if (district) {  partyColor = MAP_PARTY_COLORS[normalizeParty(district.party)]; }

        let isSelected = selectedDistrictRef.current == mapDistrictValue;

        return {
            fillColor: partyColor,
            fillOpacity: isSelected ? 1 : 0.5,
            weight: isSelected ? 4 : 2,
            color: "#6b6b6b",
        };
    };

    const onEachState = (feature, layer) => {
        if(store.mapMode === 'district' && districtPlan) {  //district tootip
            layer.bindTooltip(
                `<div class="px-3 py-2 rounded-xl bg-white shadow-lg text-sm font-medium text-gray-800">
                <strong>${feature.properties.DISTRICT}</strong><br/>
                </div>`,
            {
                permanent: false,
                sticky: true,
                direction: "top",
            });
            
            layer.on({
                mouseover: (e) =>  e.target.setStyle(highlightStyle),
                mouseout:  (e) => e.target.setStyle( districtStyle(e.target.feature) ),
            });
        }

        if(store.mapMode=="precinct" && precinctData){  //precincts tootip
            layer.bindTooltip(
                `<div class="px-3 py-2 rounded-xl bg-white shadow-lg text-sm font-medium text-gray-800">
                <strong>${feature.properties.precinct}</strong><br/>
                </div>`,
            {
                permanent: false,
                sticky: true,
                direction: "top",
                opacity: 0.9,
            });
            
            layer.on({
                mouseover: (e) => {
                    if (hoveredLayerRef.current && hoveredLayerRef.current !== e.target) {
                        hoveredLayerRef.current.closeTooltip();
                        if (store.minorityGroup) {
                            hoveredLayerRef.current.setStyle(getStyle(e.target.feature));
                        } else {
                            hoveredLayerRef.current.setStyle(lineStyle(hoveredLayerRef.current.feature));
                        }
                    }
                    hoveredLayerRef.current = e.target;
                    const currentStyle = getStyle(e.targety.feature);
                    e.target.setStyle({
                        ...currentStyle,           
                        fillColor: "#d8d8d8", 
                        color: "#6b6b6b",   
                        weight: 2.5,
                        fillOpacity: 0.9,
                    });
                    e.target.bringToFront();
                },
                mouseout: (e) => {
                    hoveredLayerRef.current = null;
                    e.target.closeTooltip();
                    if (store.minorityGroup) {
                        e.target.setStyle(getStyle(e.target.feature));
                    } else {
                        e.target.setStyle(lineStyle(layer.feature));
                    }
                },
            });
        }
    };
  

    useEffect(() => {
        if (!geoJsonRef.current) return;
        geoJsonRef.current.eachLayer((layer) => {
            layer.setStyle(districtStyle(layer.feature));
            if (String(layer.feature.properties.DISTRICT).replace(/\D/g, "") === selectedDistrictRef.current) {
                layer.bringToFront();
            }
        });
    }, [selectedDistrict]);

    return(
        <>
            <StateSelection onClose={zoomOut} />
            <div className = 'flex fixed inset-0 h-screen w-full pointer-events-none'>
                <MapSelect/>
                
                <div style={{ top: 'calc(var(--state-selection-height) + 1.25rem)' }}
                    className = 'flex flex-col absolute gap-5 w-1/3 my-5 bottom-5 z-50 right-5 pointer-events-auto'>
                    <StateDetail expanded = {expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute top-0 '/>
                    <DistrictDetail expanded = {!expanded} onClick = {()=>setExpanded(!expanded)} selectedDistrict = {selectedDistrict} onSelect = {selectDistrict} className = 'absolute bottom-0 '/>
                </div>
   
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm pointer-events-auto">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                            <span className="text-sm font-medium">Loading map...</span>
                        </div>
                    </div>
                )}
                
                <MapContainer
                    bounds={STATE_BOUNDS[name]}
                    boundsOptions={{ paddingTopLeft: [-300, 0] }}
                    className="fixed inset-0 h-screen w-full"
                >  
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />

                    {store.mapMode === 'district' && districtPlan && (<GeoJSON ref={geoJsonRef} key={`districts-${selectedState}-${districtArr.length}`} data={districtPlan} style={districtStyle} onEachFeature={onEachState} />)}
                    {store.mapMode === 'precinct' && precinctData && (<GeoJSON key={name} data={precinctData} style={getStyle} onEachFeature={onEachState} />)}

                </MapContainer>
                {store.mapMode == "precinct" && <Heatmap_Legend title="Population Percentage" items = {legend_items} />}
                
            </div>
        </>
    )
       

    
}