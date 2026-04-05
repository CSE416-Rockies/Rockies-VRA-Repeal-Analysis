import {useRef, useState, useEffect, useContext} from 'react'

import DropDownMenu from './DropDownMenu';
import GlobalStoreContext from "../store";
import GraphView from './GraphView';
import { SelectionPlaceholder } from './selectionPlaceholder';
import { UserGroupIcon } from '@heroicons/react/24/solid';

import { drawEIAnalysis } from '../utils/drawEIAnalysis';
import { useD3 } from '../hooks/useD3';
import { RACES, PRESIDENT_CAND_LEGEND, getPrimarySecondaryColors } from "../utils/constants"
import { getEIAnalysis } from '../api/api';


export default function EIAnalysis(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const racialGroup = store.racialGroup;
    const [candView, setCandView] = useState('trump'); 
    const [eiAnalysisData, setEIAnalysisData] = useState(null); 

    const ref = useRef(null);
    const margin = {top: 20, right: 20, bottom: 60, left: 80};

    // state change
    useEffect(()=>{
           if(!selectedState) return;
           getEIAnalysis(selectedState)
           .then(res => {
            console.log("EI ANALYSIS: ", res.data)
            setEIAnalysisData(res.data)
            })
           .catch(err => console.error("Error loading EI Analysis data:", err));
    }, [selectedState]);

    // draw d3 
    useD3(ref, (svg)=>{
        if(!eiAnalysisData || !racialGroup|| !ref.current) return;
        drawEIAnalysis({givenSVG: svg, data: eiAnalysisData, margin, racialLabel: racialGroup, candView});
    }, [eiAnalysisData, candView, racialGroup]);
    

    const choiceMenu = 
        <div className = 'flex gap-5 items-center'>
            <DropDownMenu options = {RACES} onSelect = {setRacialGroup} icon = {UserGroupIcon} toolTipDesc=""/>
            <div className = 'flex items-center text-gray-500 gap-5'>
                {PRESIDENT_CAND_LEGEND.map(({label})=>(
                        <button key = {label} className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setCandView(label)}>
                            <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == label? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                            <div className = 'capitalize'>{label}</div>
                        </button>
                ))}
            </div>
        </div>


    return(
    <GraphView 
        title = {`Ecological Inference (EI) Analysis: Voting Probability`}
        subtitle = {`Support for ${candView}`}
        legendItems = {getPrimarySecondaryColors(racialGroup)}
        menus = {choiceMenu}
        svgRef = {ref}
    >
        {(!racialGroup) && (
            <SelectionPlaceholder 
                message={`Please select a racial group`} 
            />
         )}
    </GraphView>        
    )
}