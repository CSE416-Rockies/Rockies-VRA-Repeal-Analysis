import {useRef, useEffect, useContext} from 'react'
import * as d3 from "d3";
import { drawBoxWhisker } from "../utils/drawBoxWhisker";
import DropDownMenu from './DropDownMenu';
import GraphView from './GraphView';
import GlobalStoreContext from "../store";
import { Squares2X2Icon, UserGroupIcon, } from "@heroicons/react/24/solid";
import { SelectionPlaceholder } from './selectionPlaceholder';

import { ENSEMBLES, RACES, BOX_WHISKER_LEGEND  } from "../utils/constants"
import { getBoxWhiskers } from '../api/api';


export default function BoxWhisker(){
    const { store, setRacialGroup, setEnsemble, setBoxWhisker } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const ensemble = store.ensemble;


    const ref = useRef(null);
    
    const margin = {top: 20, right: 20, bottom: 60, left: 80}
    
    // state change
    useEffect(() => {
        if (!selectedState) return;
        getBoxWhiskers(selectedState)
            .then(res => setBoxWhisker(res.data))  // ← into store
            .catch(err => console.error("Error loading data:", err));
    }, [selectedState]);
    
    // racialGroup or resize change
    useEffect(()=>{
        if (!store.boxWhisker || !racialGroup || !ensemble || !ref.current) return;

        const filteredData = store.boxWhisker.ensembles
            ?.find(e => e.name === ensemble)
            ?.[racialGroup];
        console.log(filteredData);

        function redraw(){
            // Draw d3 scatterplot
            d3.select(ref.current).selectAll("*").remove();                
            drawBoxWhisker({
                givenSVG: ref.current,
                data: filteredData,
                margin,
                racialLabel: racialGroup,
            });
        }

        const obsvr = new ResizeObserver(redraw);
        obsvr.observe(ref.current);
        redraw();

        return ()=> obsvr.disconnect();

    }, [store.boxWhisker, racialGroup, ensemble]);


    return(
        <GraphView 
            title = {`${racialGroup} Population Share`}
            subtitle = {ensemble ? `${ensemble}` : ""}
            svgRef={ref} 
            legendItems = {BOX_WHISKER_LEGEND}
            legendTitle = ""
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