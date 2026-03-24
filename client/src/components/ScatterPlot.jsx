import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import * as d3 from "d3";
import DropDownMenu from "./DropDownMenu";
import GraphView from "./GraphView";

import { drawScatterPlot } from "../utils/drawScatterPlot";
import { PRESIDENT_CAND_LEGEND, RACES} from "../utils/constants"
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { SelectionPlaceholder } from './selectionPlaceholder';
import { getGingles } from "../api/api";

export default function ScatterPlot(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ref = useRef(null);
    const [data, setData] = useState(null);

    const margin = {top: 20, right: 20, bottom: 60, left: 80}

    // state change
    useEffect(()=>{
        if(!selectedState) return;
        getGingles(selectedState)
        .then(res => setData(res.data))
        .catch(err => console.error("Error loading Gingles data:", err));
    }, [selectedState]);

    // racialGroup or resize change
    useEffect(()=>{
        if(!data || !racialGroup) return;

        const flatData = data.precincts.flatMap(d=>{
            const g = d.groups[racialGroup];  // direct lookup
            if (!g){
                console.error("Failed to find: ", racialGroup);
                return [];
            } 
            return [
                {precinct: d.id, racial_pct: g.pctDemo*100, vote_share: g.harris*100, party: "dem"},
                {precinct: d.id, racial_pct: g.pctDemo*100, vote_share: g.trump*100, party: "rep"}
            ]
        });

        const fits = data.regression.fits.find(f => f.group === racialGroup);
        if (!fits) return;

        const harrisFit = fits.candidates.find(c => c.candidate === "harris");
        const trumpFit = fits.candidates.find(c => c.candidate === "trump");
        if (!harrisFit || !trumpFit) return;
        
        const regression = {
            [racialGroup]: {
                dem: { b0: harrisFit.b0, b1: harrisFit.b1 },
                rep: { b0: trumpFit.b0,  b1: trumpFit.b1  }
            }
        };

        function redraw(){
            // Draw d3 scatterplot
            if (!ref.current) return;
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
            title = {`Gingles Analysis: Precinct-Level Election Results`}
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

