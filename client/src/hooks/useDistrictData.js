import {useState, useEffect} from 'react';
import { getCongressionalMap } from "../api/api.js"


export function useDistrictData(name){

    const [districtPlan, setDistrictPlan] = useState(null);

    useEffect(() => {
        getCongressionalMap(name)
            .then((res) => setDistrictPlan(res.data))
            .catch((err) => console.error("Error loading geojson:", err));
    }, [name]);

    return { districtPlan };

}
