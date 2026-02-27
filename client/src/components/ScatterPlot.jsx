import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import * as d3 from "d3";
import DropDownMenu from "./DropDownMenu";
import GraphView from "./GraphView";

import { drawScatterPlot } from "../utils/drawScatterPlot";
import { PRESIDENT_CAND_LEGEND, RACES} from "../utils/constants"


export default function ScatterPlot(){
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [racialGroup, setRacialGroup] = useState('white');  

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
    }, [selectedState])


    // racialGroup or resize change
    useEffect(()=>{
        if(!data) return;

        const racialPct = `${racialGroup}_pct`;
        const flatData =  data.flatMap(d=>[
            {precinct: d.precinct, racial_pct: d[racialPct], vote_share: d.dem_share, party: "dem"},
            {precinct: d.precinct, racial_pct: d[racialPct], vote_share: d.rep_share, party: "rep" }
        ])

        function redraw(){
            // Draw d3 scatterplot
            d3.select(ref.current).selectAll("*").remove();                // prevent rednering on top of each other
            drawScatterPlot({givenSVG: ref.current, data: flatData, margin, racialLabel: racialGroup});
        }

        const obsvr = new ResizeObserver(redraw);
        obsvr.observe(ref.current);
        redraw();

        return ()=> obsvr.disconnect();

    }), [data, racialGroup];


    return(
        
        <GraphView 
            title = {`2024 Precinct-Level Presidential Election [${selectedState}]`}
            subtitle = {`By ${racialGroup} Population`}
            svgRef = {ref}
            legendTitle = "Votes"
            legendItems = {PRESIDENT_CAND_LEGEND}
            menus = {<DropDownMenu  options = {RACES} onSelect = {setRacialGroup}/>}
        />
    )
    
    

}

