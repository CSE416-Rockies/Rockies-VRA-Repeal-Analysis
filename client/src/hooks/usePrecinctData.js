import {useState, useEffect} from 'react';
import { getPrecinctMap } from "../api/api.js"
import { feature } from "topojson-client"

export function usePrecinctData(name, mapMode){
    const [precinctData, setPrecinctData] = useState(null);

    useEffect(() => {
        if(mapMode === 'precinct' && !precinctData) {
            getPrecinctMap(name)                     //(put path of precinct geojsons)
                .then((res) => res.data)
                .then(topology => {
                    const geojson = feature(
                        topology,
                        topology.objects.data       // name of object inside topojson
                    );
                    setPrecinctData(geojson);
                })
                .catch((err) => console.error("Error loading geojson:", err));
        }
    }, [name, mapMode, precinctData]);

    return { precinctData }
}