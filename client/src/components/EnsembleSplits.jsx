import {useRef, useState, useEffect, useContext} from 'react';
import * as d3 from "d3";

import GlobalStoreContext from "../store";
import GraphView from './GraphView';
import { SelectionPlaceholder } from './selectionPlaceholder';
import { ENSEMBLE_LEGEND } from "../utils/constants"
import drawEnsembleSplits from '../utils/drawEnsembleSplits';


export default function EnsembleSplits(){
    const {store} = useContext(GlobalStoreContext);
    const [type, setType] = useState(null);
    const ref = useRef(null);
    const [candView, setCandView] = useState(null); 
    const [data, setData] = useState(null);

    const stateName = store?.selectedState ?? null; 

    const margin = {top: 20, right: 20, bottom: 60, left: 80}


    const list = [{label:"race-blind"}, {label:"VRA"}, {label: "both"}]

    useEffect(()=>{
        if(!stateName) return;
        console.log("statename: ", stateName);
        const stateJson = stateName == "Georgia" ? 
                        "/graphs/ga_ensemble.json" :  
                        "/graphs/de_ensemble.json";
        console.log(stateJson);
        d3.json(stateJson).then( rawData => { setData(rawData);}) 
            .catch((err)=>console.error("Error loading geojson:", err));
        console.log(data)
    }, [stateName]);

    useEffect(() =>{
        if(!ref.current || !data || !candView) return;
        d3.select(ref.current).selectAll("*").remove();
        d3.selectAll(".tooltip-ensemble").remove();
        const stateKey = Object.keys(data)[0];
        const stateData = data[stateKey];

        drawEnsembleSplits({
            givenSVG: ref.current,
            data: stateData,
            margin,
            candView,
        });
    }, [candView, data]);

    const choiceMenu = 
            <div className = 'flex gap-5 items-center'>
                <div className = 'flex items-center text-gray-500 gap-5'>
                    {list.map(({label})=>(
                            <button key = {label} className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setCandView(label)}>
                                <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == label? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                                <div className = 'capitalize'>{label}</div>
                            </button>
                    ))}
                </div>
            </div>

    return(
        <GraphView title="Ensemble Splits" 
            subtitle={type} 
            legendTitle={(candView == "both") ? "Party" : ""} 
            legendItems={(candView == "both") ? ENSEMBLE_LEGEND : []}
            svgRef={ref}
            menus={choiceMenu}
        >
           {(!stateName || !candView) && (
                <SelectionPlaceholder message={
                    !stateName ? "Please select a state" : "Please select a graph type"
                }/>
            )}


        </GraphView>
    )
}