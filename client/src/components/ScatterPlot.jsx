import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import DropDownMenu from "./DropDownMenu";
import GraphView from "./GraphView";

import { drawScatterPlot } from "../utils/drawScatterPlot";
import { useD3 } from "../hooks/useD3";

import { PRESIDENT_CAND_LEGEND, RACES} from "../utils/constants"
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { SelectionPlaceholder } from './selectionPlaceholder';
import { getGingles } from "../api/api";

export default function ScatterPlot(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ref = useRef(null);
    const [ginglesData, setGinglesData] = useState(null);

    const margin = {top: 20, right: 20, bottom: 60, left: 80}

    // state change
    useEffect(()=>{
        if(!selectedState) return;
        getGingles(selectedState)
        .then(res => setGinglesData(res.data))
        .catch(err => console.error("Error loading Gingles data:", err));
    }, [selectedState]);

    // draw d3 
    useD3(ref, (svg)=>{
        if(!ginglesData || !racialGroup) return;
        drawScatterPlot({givenSVG: svg, data: ginglesData, margin, racialLabel: racialGroup});
    }, [ginglesData, racialGroup]);


    return(
        
        <GraphView 
            title = {`Gingles Analysis: Precinct-Level Election Results`}
            subtitle = {`By ${racialGroup} Population`}
            svgRef = {ref}
            legendItems = {PRESIDENT_CAND_LEGEND}
            menus = {<DropDownMenu  options = {RACES} onSelect = {setRacialGroup} icon={UserGroupIcon} toolTipDesc=""/>}
        >{(!racialGroup) && (
            <SelectionPlaceholder 
                message={`Please select a racial group`} 
            />
        )}
        </GraphView>   
    
    )
    
    

}

