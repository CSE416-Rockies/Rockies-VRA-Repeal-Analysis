import {useRef, useState, useEffect, useContext} from 'react';
import * as d3 from "d3";

import GlobalStoreContext from "../store";
import GraphView from './GraphView';
import { SelectionPlaceholder } from './selectionPlaceholder';
import { ENSEMBLE_LEGEND } from "../utils/constants"
import drawEnsembleSplits from '../utils/drawEnsembleSplits';
import { useD3 } from '../hooks/useD3';
import { RACES } from '../utils/constants';
import DropDownMenu from './DropDownMenu';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { getEnsembleSplits } from '../api/api';

export default function EnsembleSplits(){
    const {store, setRacialGroup } = useContext(GlobalStoreContext);
    const ref = useRef(null);
    const [candView, setCandView] = useState(null); 
    const [data, setData] = useState(null);

    const stateName = store?.selectedState ?? null; 
    const racialGroup = store.racialGroup;

    const margin = {top: 20, right: 20, bottom: 60, left: 80}


    const list = [{label:"raceBlind"}, {label:"vra"}, {label: "both"}]

    useEffect(()=>{
        if(!stateName) return;
        getEnsembleSplits(stateName)
        .then(res => setData(res.data))
        .catch(err => console.error("Error loading ensemble splits:", err));
    }, [stateName]);

    // draw d3
    useD3(ref, (svg) => {
        if( !data || !candView || !racialGroup) return;
        d3.selectAll(".tooltip-ensemble").remove();
        drawEnsembleSplits({ givenSVG: svg, data: data, margin, candView, racialGroup});
    }, [data, racialGroup, candView]);

    

    const choiceMenu = 
            <div className = 'flex gap-5 items-center'>
                <DropDownMenu options = {RACES} onSelect = {setRacialGroup} icon = {UserGroupIcon} toolTipDesc=""/>
                <div className = 'flex items-center text-gray-500 gap-5'>
                    {list.map(({label})=>(
                            <button key = {label} className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setCandView(label)}>
                                <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == label? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                                <div className = 'capitalize'>{label}</div>
                            </button>
                    ))}
                </div>
            </div>

    let placeholderMessage;
    if (!stateName && !candView && !racialGroup) {
        placeholderMessage = "Please select a state, a graph type, and a racial group";
    } else if (!candView && !stateName) {
        placeholderMessage = "Please select a graph type and a state";
    } else if (!racialGroup && !stateName) {
        placeholderMessage = "Please select a racial group and a state";
    }else if(!stateName){
        placeholderMessage = "Please select a state";
    }else if(!candView){
        placeholderMessage = "Please select a graph type";
    }else if(!racialGroup){
        placeholderMessage = "Please select a racial group";
    }

    return(
        <GraphView title={`${candView} Ensemble Splits for ${racialGroup} `}
            legendItems={(candView == "both") ? ENSEMBLE_LEGEND : []}
            svgRef={ref}
            menus={choiceMenu}
        >
        {(!stateName || !candView || !racialGroup) && (
            <SelectionPlaceholder message={placeholderMessage}/>
        )}


        </GraphView>
    )
}