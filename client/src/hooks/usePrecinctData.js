import {useState, useEffect} from 'react';
import { getPrecinctMap } from "../api/api.js"
import { feature } from "topojson-client"

export function usePrecinctData(name, mapMode){
    const [precinctData, setPrecinctData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(mapMode === 'precinct' && !precinctData) {
            getPrecinctMap(name)                    
                .then((res) => {
                    console.log("RAW RES:", res);
                    return res.data
                })
                .then(topology => {
                    const parsed = typeof topology === "string"
                        ? JSON.parse(topology)
                        : topology;

                    console.log(parsed)
                    const objectKey = Object.keys(parsed.objects)[0];
                    console.log(objectKey)
                    const geojson = feature(
                        parsed,
                        parsed.objects["data"]       // name of object inside topojson
                    );
                    setPrecinctData(geojson);
                })
                .catch((err) => {
                    console.error("Error loading geojson:", err);
                    if (!err.response) setError("Unable to connect to the server.");
                    else setError("Failed to load map data.");
                });
        }
    }, [name, mapMode, precinctData]);

    return { precinctData, error }
}