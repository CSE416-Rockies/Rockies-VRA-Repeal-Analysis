import { useState, useEffect, useContext, useRef } from "react"
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import GlobalStoreContext from "../store/index.jsx";
import StateDetail from './StateDetail.jsx';
import DistrictDetail from './DistrictDetail.jsx';
import EnsembleDetail from "./EnsembleDetail.jsx";
import MapSelect from './MapSelect.jsx';
import StateSelection from "./StateSelection.jsx";
import Heatmap_Legend from "./Heatmap_Legend.jsx";
import LoadingView from "./LoadingView.jsx";
import NotFound from "./NotFound.jsx";

import { useDistrictData } from "../hooks/useDistrictData.js";
import { usePrecinctData } from "../hooks/usePrecinctData.js";

import { MAP_PARTY_COLORS, STATE_BOUNDS, VALID_STATES, CHOROPLETH_COLORS } from "../utils/constants.js";
import { choroplethStyle, highlightStyle, lineStyle } from "../utils/mapStyles.js";
import { normalizeDistrict, normalizeParty } from "../utils/helpers.js";

import { getStateLegend } from "../api/api.js";


export default function MapView(){
    const { store } = useContext(GlobalStoreContext); 
    const { name } = useParams();

    const [expanded, setExpanded] = useState('state') // expandable detail panels: 'state' | 'district' | 'ensemble'
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [legendItems, setLegendItems] = useState([]); 

    const hoveredLayerRef = useRef(null);
    const selectedDistrictRef = useRef(null);
    const districtRef = useRef(null);
    const minorityGroupRef = useRef(store.minorityGroup);


    const selectedState = store?.selectedState || "";
    const districtArr = store?.representatives || [];

    const { districtPlan, error: districtError  } = useDistrictData(name);
    const { precinctData, error: precinctError  } = usePrecinctData(name, store.mapMode);

    const navigate = useNavigate();

    const zoomOut = () =>{
        navigate(`/`);
    };

    const isLoading =   (store.mapMode === 'district' && !districtPlan) || 
                        (store.mapMode === 'precinct' && !precinctData);

    const getStyle = (feature) => minorityGroupRef.current ? choroplethStyle(feature, minorityGroupRef.current) : lineStyle(feature);
    const selectDistrict = (val) => {
        const normalized = val ? String(val) : null;
        if (normalized === selectedDistrictRef.current || !val){        // toggle on off
            selectedDistrictRef.current = null;
        } else{
            selectedDistrictRef.current = normalized;
            setExpanded('district');
        }
        setSelectedDistrict(selectedDistrictRef.current);
    };

    const districtStyle = (feature) => {
        const mapDistrictValue = normalizeDistrict(feature.properties.DISTRICT);

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
                click: () =>{
                    console.log(layer.feature.properties.DISTRICT);
                    selectDistrict(normalizeDistrict(layer.feature.properties.DISTRICT));
                },
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
                        if (minorityGroupRef.current) {
                            hoveredLayerRef.current.setStyle(getStyle(e.target.feature));
                        } else {
                            hoveredLayerRef.current.setStyle(lineStyle(hoveredLayerRef.current.feature));
                        }
                    }
                    hoveredLayerRef.current = e.target;
                    const currentStyle = getStyle(e.target.feature);
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
                    if (minorityGroupRef.current) {
                        e.target.setStyle(getStyle(e.target.feature));
                    } else {
                        e.target.setStyle(lineStyle(e.target.feature));
                    }
                },
            });
        }
    };
  

    useEffect(() => {
        if (!districtRef.current) return;
        districtRef.current.eachLayer((layer) => {
            layer.setStyle(districtStyle(layer.feature));
            if (normalizeDistrict(layer.feature.properties.DISTRICT) === selectedDistrictRef.current) {
                layer.bringToFront();
            }
        });
    }, [selectedDistrict]);

    useEffect(() => {
        minorityGroupRef.current = store.minorityGroup;
    }, [store.minorityGroup]);

    useEffect(() => {
        if (!selectedState || !store.minorityGroup) return;
        getStateLegend(selectedState)
        .then((res) => {
            const data = res.data;
            const race = store.minorityGroup;

            if (!data[race]) {
                console.error(`No legend data for minority group: ${race}`);
                return;
            }

            const bins = data[race].bins;
            const min = data[race].min;
            
            const items = bins.map((bin, i) => {
                let start = i === 0 ? min : bins[i - 1];
                let end = bin;
                return {
                    label: `${start.toFixed(1)}% - ${end.toFixed(1)}%`,
                    color: CHOROPLETH_COLORS[i]
                }
            });

            setLegendItems(items);
        })
        .catch((err) => console.error("Error loading legend:", err));            
    }, [selectedState, store.minorityGroup]);

    /* ---------------------------------------------------------------------------  invalid state URL*/
    if(!VALID_STATES.has(name)){
        return <NotFound/>
    }

    return(
        <>
            <StateSelection onClose={zoomOut} />
            <div className = 'flex fixed inset-0 h-screen w-full pointer-events-none'>
                <MapSelect/>
                
                <div style={{ top: 'calc(var(--state-selection-height) + 1.25rem)', width: 'var(--sidebar-width)'  }}
                    className = 'flex flex-col absolute gap-3 my-5 bottom-5 z-50 right-5 pointer-events-auto'
                >
                    <StateDetail expanded = {expanded === 'state'} onClick = {()=>setExpanded('state')} />
                    <DistrictDetail expanded = {expanded === 'district'} onClick = {()=>setExpanded('district')} selectedDistrict = {selectedDistrict} onSelect = {selectDistrict} />
                    <EnsembleDetail expanded = {expanded === 'ensemble'} onClick = {()=>setExpanded('ensemble')} />
                </div>
   
                {(districtError || precinctError) 
                    ? <LoadingView text="Unable to connect to the server." />
                    : isLoading && <LoadingView text="Loading map..." />
                }
                
                <MapContainer
                    bounds={STATE_BOUNDS[name]}
                    boundsOptions={{ paddingTopLeft: [-300, 0] }}
                    className="fixed inset-0 h-screen w-full"
                >  
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />

                    {store.mapMode === 'district' && districtPlan && (<GeoJSON ref={districtRef} key={`districts-${selectedState}-${districtArr.length}`} data={districtPlan} style={districtStyle} onEachFeature={onEachState} />)}
                    {store.mapMode === 'precinct' && precinctData && (<GeoJSON key={name} data={precinctData} style={getStyle} onEachFeature={onEachState} />)}

                </MapContainer>
                {store.mapMode == "precinct" && store.minorityGroup && <Heatmap_Legend title="Population Percentage" items = {legendItems} />}
                
            </div>
        </>
    )
       

    
}