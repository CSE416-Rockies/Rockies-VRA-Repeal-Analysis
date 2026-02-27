import {useEffect, useRef, useState, useContext} from "react"
import GlobalStoreContext from '../store';
import * as d3 from "d3";
import { drawScatterPlot } from "../utils/drawScatterPlot";
import DropDownMenu from "./DropDownMenu";

export default function ScatterPlot(){
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [minority, setMinority] = useState('white');  

    const ref = useRef();
    const races = ["white", "black", "asian", "latino", "other"]

    useEffect(()=>{
        const stateJson = selectedState == "Georgia" ? 
                          "/scatterplot/ga_precincts.json" :  
                          "/scatterplot/de_precincts.json";

        console.log("fetching", stateJson);

        const minorityPct = `${minority}_pct`;

        d3.json(stateJson).then( rawData => {

            // Rearrange data for scatterplot 
            const data = rawData.flatMap(d=>[
                {precinct: d.precinct, minority_pct: d[minorityPct], vote_share: d.dem_share, party: "dem"},
                {precinct: d.precinct, minority_pct: d[minorityPct], vote_share: d.rep_share, party: "rep" }
            ])

            // Draw d3 scatterplot
            const givenSVG = ref.current;
            d3.select(givenSVG).selectAll("*").remove();                // prevent rednering on top of each other

            const margin = {top: 20, right: 20, bottom: 60, left: 80}
            
            drawScatterPlot({givenSVG, data, margin, minorityLabel: minority});

        }) .catch((err)=>console.error("Error loading geojson:", err));

        
    }, [selectedState, minority])


    return(
        <div className = 'flex justify-center items-center w-full h-full bg-gray-200'>    
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'>    
                <DropDownMenu options = {races} onSelect = {setMinority}/>
                <div className = 'flex flex-col w-full h-full px-15 py-20 justify-center items-center gap-10 bg-white rounded-xl'>
                    <div className = 'flex flex-col gap-5 justify-center items-center'>
                        <div className = 'text-3xl'>2024 Precinct-Level Presidential Election [{selectedState}]</div>
                        <div className = 'text-xl capitalize'>By {minority} Population</div>
                    </div>
                    <svg width = "80%" height = "100%" ref = {ref} />
                </div>
            </div>
            
        </div>
    )
    
    

}

