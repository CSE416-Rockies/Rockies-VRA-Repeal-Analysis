import {useRef, useState, useEffect, useContext} from 'react'
import * as d3 from "d3";
import { drawBoxWhisker } from "../utils/drawBoxWhisker";
import DropDownMenu from './DropDownMenu';
import GraphView from './GraphView';
import GlobalStoreContext from "../store";
import { Squares2X2Icon, UserGroupIcon, } from "@heroicons/react/24/solid";
import { SelectionPlaceholder } from './selectionPlaceholder';

import { ENSEMBLES, RACES, BOX_WHISKER_LEGEND  } from "../utils/constants"


export default function BoxWhisker(){
    const { store, setRacialGroup, setEnsemble } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ensemble = store.ensemble;


    const ref = useRef(null);
    const [data, setData] = useState(null);
    
    const margin = {top: 20, right: 20, bottom: 60, left: 80}
    
    // state change
    useEffect(()=>{
        const stateJson = selectedState == "Georgia" ? 
                        "/boxwhisker/ga_box_whisker.json" :  
                        "/boxwhisker/de_box_whisker.json";
    
        d3.json(stateJson).then( rawData => { setData(rawData);}) 
            .catch((err)=>console.error("Error loading geojson:", err));
    }, [selectedState])
    
    // racialGroup or resize change
    useEffect(()=>{
        if (!data || !racialGroup || !ensemble || !ref.current) return;

        const filteredData = data[ensemble]?.[racialGroup];
        console.log(filteredData);

        function redraw(){
            // Draw d3 scatterplot
            d3.select(ref.current).selectAll("*").remove();                // prevent rednering on top of each other
            drawBoxWhisker({
                givenSVG: ref.current,
                data: filteredData,
                margin,
                racialLabel: racialGroup,
                showProposed: !!filteredData[0]?.proposed
            });
        }

        const obsvr = new ResizeObserver(redraw);
        obsvr.observe(ref.current);
        redraw();

        return ()=> obsvr.disconnect();

    }, [data, racialGroup, ensemble]);


    return(
        <GraphView 
            title = {`${racialGroup} Population Share`}
            subtitle = {ensemble ? `${ensemble}` : ""}
            svgRef={ref} 
            legendItems = {BOX_WHISKER_LEGEND}
            legendTitle = "Plan"
            menus = {
                    <div className='flex gap-5'>
                        <DropDownMenu  options = {RACES} onSelect = {setRacialGroup} icon={UserGroupIcon}/>
                        <DropDownMenu  options = {ENSEMBLES} onSelect = {setEnsemble} text={"Set Ensemble"} icon={Squares2X2Icon}/>
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