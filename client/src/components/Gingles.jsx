import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import { UserGroupIcon } from "@heroicons/react/24/solid";

import DropDownMenu from "./DropDownMenu";
import GraphView from "./GraphView";
import { SelectionPlaceholder } from './SelectionPlaceholder';

import { drawGingles } from "../utils/drawGingles";
import { PRESIDENT_CAND_LEGEND, FEASIBLE_RACES} from "../utils/constants"
import { useD3 } from "../hooks/useD3";

import { getGingles } from "../api/api";
import ErrorMsg from "./ErrorMsg";

export default function Gingles(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ref = useRef(null);
    const [ginglesData, setGinglesData] = useState(null);
    const [error, setError] = useState(null);

    const margin = {top: 40, right: 20, bottom: 60, left: 80};

    useEffect(()=>{
        if(!selectedState) return;
        getGingles(selectedState)
        .then(res => {
            setGinglesData(res.data);
            console.log(res.data);
        })
        .catch(err => {
            console.error("Error loading Gingles data:", err);
            setError("Failed to load data.");
        });
    }, [selectedState]);

    useD3(ref, (svg)=>{
        if(!ginglesData || !racialGroup) return;
        drawGingles({givenSVG: svg, data: ginglesData, margin, racialLabel: racialGroup});
    }, [ginglesData, racialGroup]);


    return(
        
        <GraphView 
            title = {`Gingles Analysis: Precinct-Level Election Results`}
            subtitle = {`By ${racialGroup} Population`}
            svgRef = {ref}
            legendItems = {PRESIDENT_CAND_LEGEND}
            menus = {<DropDownMenu  options = {FEASIBLE_RACES[selectedState]} onSelect = {setRacialGroup} icon={UserGroupIcon} toolTipDesc=""/>}
        >{
            error ? <ErrorMsg message={error}/> : 
            (!racialGroup) && (
            <SelectionPlaceholder 
                message={`Please select a racial group`} 
            />
        )}
        </GraphView>   
    
    )
    
    

}

