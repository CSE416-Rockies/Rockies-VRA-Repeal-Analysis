import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import * as d3 from "d3";
import DropDownMenu from "./DropDownMenu";
import GraphView from "./GraphView";

import { drawScatterPlot } from "../utils/drawScatterPlot";
import { PRESIDENT_CAND_LEGEND, RACES} from "../utils/constants"
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { SelectionPlaceholder } from './selectionPlaceholder';


export default function ScatterPlot(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ref = useRef(null);
    const [data, setData] = useState(null);

    const margin = {top: 20, right: 20, bottom: 60, left: 80}

    // state change
    useEffect(()=>{
        const stateJson = selectedState == "Georgia" ? 
                          "/graphs/ga_gingles.json" :  
                          "/graphs/de_gingles.json";

        d3.json(stateJson).then( rawData => { setData(rawData);}) 
                        .catch((err)=>console.error("Error loading geojson:", err));
    }, [selectedState]);

    // racialGroup or resize change
    useEffect(()=>{
        console.log("racial gruop: ", racialGroup);
        if(!data || !racialGroup) return;

        const flatData =  data.precincts.flatMap(d=>[
            {precinct: d.id, racial_pct: d[racialGroup].pct_demo*100, vote_share: d[racialGroup].harris*100, party: "dem"},
            {precinct: d.id, racial_pct: d[racialGroup].pct_demo*100, vote_share: d[racialGroup].trump*100, party: "rep" }
        ]);
        const regression = {
            [racialGroup]: {
                dem: { b0: data.regression.fits[racialGroup].harris.b0, b1: data.regression.fits[racialGroup].harris.b1 },
                rep: { b0: data.regression.fits[racialGroup].trump.b0,  b1: data.regression.fits[racialGroup].trump.b1  }
            }
        };

        function redraw(){
            // Draw d3 scatterplot
            d3.select(ref.current).selectAll("*").remove();                // prevent rednering on top of each other
            drawScatterPlot({givenSVG: ref.current, data: flatData, margin, racialLabel: racialGroup, regression});
        }

        const obsvr = new ResizeObserver(redraw);
        obsvr.observe(ref.current);
        redraw();

        return ()=> obsvr.disconnect();

    }, [data, racialGroup]);


    return(
        
        <GraphView 
            title = {`Gingles Analysis [${selectedState}]`}
            subtitle = {`By ${racialGroup} Population`}
            svgRef = {ref}
            legendTitle = "Votes"
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

