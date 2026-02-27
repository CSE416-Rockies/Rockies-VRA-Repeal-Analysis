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

    const navigate = useNavigate();

    const zoomOut = () =>{
        navigate(`/`);
    };

    useEffect(() => {
        fetch(`/geojson/${name}_Congressional_Districts.json`)
            .then((res) => res.json())
            .then((data) => setDistrictPlan(data))
            .catch((err) => console.error("Error loading geojson:", err));
    }, [name]);

    /* BELOW IS GEOJSON FILE USEEFFECT THAT'S NOT IN USE  */
    // useEffect(() => {
    //     if(store.mapMode === 'precinct' && !precinctData) {
    //         fetch(`/geojson/${name}_precincts.geojson`) //(put path of precinct geojsons)
    //             .then((data) => setPrecinctData(data))
    //             .catch((err) => console.error("Error loading geojson:", err));
    //     }
    // }, [store.mapMode, precinctData]);


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
                    {store.mapMode === 'district' && districtPlan && (<GeoJSON data={districtPlan} style={lineStyle} />)}
                    {store.mapMode === 'precinct' && precinctData && (<GeoJSON data={precinctData} style={lineStyle} />)}
                </MapContainer>
    
            </div>
        </>
    )
       

    
}