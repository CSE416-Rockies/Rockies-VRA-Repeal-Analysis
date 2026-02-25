import { useState, } from "react"
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, } from "react-leaflet";

import StateDetail from './StateDetail.jsx';
import DistrictDetail from './DistrictDetail.jsx';
import MapSelect from './MapSelect.jsx';

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
    const [expanded, setExpanded] = useState(true);
    const { name } = useParams();

    return(
        <>
            
            <div className = 'flex fixed inset-0 h-screen w-full pointer-events-none'>
                <MapSelect/>
                <div className = 'flex flex-col absolute gap-5 w-1/3 my-5 top-40 bottom-5 z-50 right-5 pointer-events-auto'>
                    <StateDetail expanded = {expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute top-0 '/>
                    <DistrictDetail expanded = {!expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute bottom-0 '/>
                </div>

                <MapContainer
                    bounds={stateBounds[name]}
                    className="fixed inset-0 h-screen w-full"
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />
                </MapContainer>
            
            </div>
        </>
    )
       

    
}