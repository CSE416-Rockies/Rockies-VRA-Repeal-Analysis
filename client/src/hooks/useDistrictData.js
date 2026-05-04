import {useState, useEffect} from 'react';
import { getCongressionalMap } from "../api/api.js"

export function useDistrictData(name){
    const [districtPlan, setDistrictPlan] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCongressionalMap(name)
            .then((res) => setDistrictPlan(res.data))
            .catch((err) => {
                console.error("Error loading geojson:", err);
                if (!err.response) setError("Unable to connect to the server.");
                else setError("Failed to load map data.");
            });
    }, [name]);

    return { districtPlan, error };

}
