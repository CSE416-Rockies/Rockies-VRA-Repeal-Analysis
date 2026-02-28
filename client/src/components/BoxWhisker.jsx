import {useRef, useState, useEffect, useContext} from 'react'
import * as d3 from "d3";
import { drawScatterPlot } from "../utils/drawScatterPlot";
import DropDownMenu from './DropDownMenu';
import GraphView from './GraphView';
import GlobalStoreContext from "../store";
import { Squares2X2Icon, UserGroupIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Legend from './Legend';

import { ENSEMBLES, RACES, PRESIDENT_CAND_LEGEND } from "../utils/constants"


export default function BoxWhisker(){
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [racialGroup, setRacialGroup] = useState(null);
    const [ensemble, setEnsemble] = useState(null); 


    const ref = useRef(null);
    const [data, setData] = useState(null);
    
    const margin = {top: 20, right: 20, bottom: 60, left: 80}

    const SelectionPlaceholder = ({ message }) => (
        <div className="flex flex-col w-full items-center justify-center h-full text-gray-500 gap-4">
            <div className="flex items-center gap-1 p-6 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                <InformationCircleIcon className="w-12 h-12 text-gray-400" />
                <p className="text-xl font-medium">{message}</p>
            </div>
        </div>
    );
    
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
        if (!data || !racialGroup || !ensemble || !ref.current) return;

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

    });


    return(
        
        <GraphView 
            title = {`2024 Precinct-Level Presidential Election [${selectedState}]`}
            subtitle = {`By ${racialGroup} Population`}
            svgRef = {ref}
            legendTitle = "Votes"
            legendItems = {PRESIDENT_CAND_LEGEND}
            menus = {
                    <div className='flex gap-5'>
                        <DropDownMenu  options = {ENSEMBLES} onSelect = {setEnsemble} text={"Set Ensemble"} icon={Squares2X2Icon}/>
                        <DropDownMenu  options = {RACES} onSelect = {setRacialGroup} icon={UserGroupIcon}/>
                    </div>
            }
        > 
            {(!racialGroup || !ensemble) && (
                <SelectionPlaceholder 
                    message={`Please select a ${!ensemble ? 'district ensemble' : ''}${!ensemble && !racialGroup ? ' and ' : ''}${!racialGroup ? 'racial group' : ''}`} 
                />
            )}
        </GraphView>
    )
}