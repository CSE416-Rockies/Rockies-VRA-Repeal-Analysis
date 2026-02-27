import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import * as d3 from "d3";
import DropDownMenu from "./DropDownMenu";
import Legend from "./Legend";

import { drawScatterPlot } from "../utils/drawScatterPlot";
import { PARTY_LEGEND, RACES} from "../utils/constants"


export default function ScatterPlot(){
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [racialGroup, setRacialGroup] = useState('white');  

    const ref = useRef();
    const [data, setData] = useState(null);

    const margin = {top: 20, right: 20, bottom: 60, left: 80}

    // state change
    useEffect(()=>{
        const stateJson = selectedState == "Georgia" ? 
                          "/scatterplot/ga_precincts.json" :  
                          "/scatterplot/de_precincts.json";

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
        return ()=> obsvr.disconnect();

    }), [data, racialGroup];


    return(
        <div className = 'flex justify-center items-center w-full h-full bg-gray-200'>    
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'>    
                <DropDownMenu options = {RACES} onSelect = {setRacialGroup}/>
                <div className = 'flex flex-col w-full h-full px-15 py-10 justify-center items-center gap-5 bg-white rounded-xl'>
                    <div className = 'flex flex-col gap-5 justify-center items-center'>
                        <div className = 'text-3xl'>2024 Precinct-Level Presidential Election [{selectedState}]</div>
                        <div className = 'text-xl capitalize'>By {racialGroup} Population</div>
                    </div>
                    <div className = 'flex w-full h-full px-20 items-center justify-between'>
                        <svg width = "100%" height = "100%" ref = {ref} />
                        <Legend title = "Votes" items = {PARTY_LEGEND}/>
                    </div>
                </div>
            </div>
            
        </div>
    )
    
    

}

