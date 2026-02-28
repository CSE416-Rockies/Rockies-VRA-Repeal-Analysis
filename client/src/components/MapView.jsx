import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson-client";

import GlobalStoreContext from "../store/index.jsx";
import StateDetail from './StateDetail.jsx';
import DistrictDetail from './DistrictDetail.jsx';
import MapSelect from './MapSelect.jsx';
import StateSelection from "./StateSelection.jsx";
import { CommandLineIcon } from "@heroicons/react/24/solid";
import Heatmap_Legend from "./Heatmap_Legend.jsx";


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
    const [districtPlan, setDistrictPlan] = useState(null);
    const [precinctData, setPrecinctData] = useState(null);
    const [map, setMap] = useState(null);


    const lineStyle = (feature) => {
        return {
        fillOpacity: 0,
        weight: 1,
        color: "#6b6b6b",
        };
    };

    const highlightStyle = {
        fillColor: "#d8d8d8", 
        color: "#6b6b6b",     
        weight: 2,
        fillOpacity: 1,
    }

    const navigate = useNavigate();

    const zoomOut = () =>{
        navigate(`/`);
    };

    useEffect(() => {
        fetch(`/geojson/${name}_Congressional_Districts.geojson`)
            .then((res) => res.json())
            .then((data) => setDistrictPlan(data))
            .catch((err) => console.error("Error loading geojson:", err));
    }, [name]);

    useEffect(() => {
        if(store.mapMode === 'precinct' && !precinctData) {
            fetch(`/geojson/${name}_precincts_topo.topojson`) //(put path of precinct geojsons)
                .then((res) => res.json())
                .then(topology => {
                        console.log(Object.keys(topology.objects.data.geometries));
                        const geojson = feature(
                        topology,
                        topology.objects.data // name of object inside topojson
                    );

                    console.log("geojson: ", geojson);
                    setPrecinctData(geojson);
                })
                .catch((err) => console.error("Error loading geojson:", err));
        }
    }, [store.mapMode, precinctData]);

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
                mouseover: (e) => {
                e.target.setStyle(highlightStyle);
                },
                mouseout: (e) => {
                e.target.setStyle(lineStyle(feature));
                },
                // click: (e) => {
                // }
            });
        }

        if(store.mapMode=="precinct" && precinctData){  //precincts tootip
            layer.bindTooltip(
                `<div class="px-3 py-2 rounded-xl bg-white shadow-lg text-sm font-medium text-gray-800">
                <strong>${feature.properties.precicnt}</strong><br/>
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
                layer.setStyle(lineStyle(feature));
                },
                // click: (e) => {
                // }
            });
        }
    };

    console.log("rendering MapContainer for", name);
    return(
        <>
            <StateSelection onClose={zoomOut} />
            <div className = 'flex fixed inset-0 h-screen w-full pointer-events-none'>
                <MapSelect/>
                <div className = 'flex flex-col absolute gap-5 w-1/3 my-5 top-40 bottom-5 z-50 right-5 pointer-events-auto'>
                    <StateDetail expanded = {expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute top-0 '/>
                    <DistrictDetail expanded = {!expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute bottom-0 '/>
                </div>

                <MapContainer
                    bounds={stateBounds[name]}
                    whenCreated = {setMap}
                    className="fixed inset-0 h-screen w-full"
                >  
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />
                    {store.mapMode === 'district' && districtPlan && (<GeoJSON data={districtPlan} style={lineStyle} onEachFeature={onEachState} />)}
                    {store.mapMode === 'precinct' && precinctData && (<GeoJSON data={precinctData} style={lineStyle} onEachFeature={onEachState} />)}
                    
                </MapContainer>
                {store.mapMode == "precinct" && <Heatmap_Legend titles="" items = {legend_items} />}
                
            </div>
        </>
    )
       

    
}