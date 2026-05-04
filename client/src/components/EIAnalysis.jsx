import {useRef, useState, useEffect, useContext} from 'react'

import DropDownMenu from './DropDownMenu';
import GlobalStoreContext from "../store";
import GraphView from './GraphView';
import { SelectionPlaceholder } from './SelectionPlaceholder';
import { UserGroupIcon } from '@heroicons/react/24/solid';

import { drawEIAnalysis } from '../utils/drawEIAnalysis';
import { computeOverlapPct } from '../utils/helpers';
import { useD3 } from '../hooks/useD3';
import { RACES, PRESIDENT_CAND_LEGEND, PARTY_REFS, getCandidateColors, getCompareColors } from "../utils/constants"

import { getEIAnalysis } from '../api/api';
import ErrorMsg from './ErrorMsg';


export default function EIAnalysis(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const racialGroup = store.racialGroup;

    const [candView, setCandView] = useState('dem'); 
    const [eiAnalysisData, setEIAnalysisData] = useState(null); 
    const [error, setError] = useState(null);


    const ref = useRef(null);
    const margin = {top: 20, right: 20, bottom: 60, left: 80};

    // state change
    useEffect(()=>{
        if(!selectedState) return;
        getEIAnalysis(selectedState)
            .then(res => {
                setEIAnalysisData(res.data)
                })
            .catch( err => {
                console.error("Error loading EI Analysis data:", err);
                setError("Failed to load data.");
            });
    }, [selectedState]);

    // draw d3 
    useD3(ref, (svg)=>{
        if(!eiAnalysisData || !racialGroup|| !ref.current) return;
        drawEIAnalysis({ givenSVG: svg, data: eiAnalysisData, margin, racialLabel: racialGroup, candView });
    }, [eiAnalysisData, candView, racialGroup]);
    

    const choiceMenu = (
        <div className = 'flex gap-5 items-center'>
            <DropDownMenu options = {RACES} onSelect = {setRacialGroup} icon = {UserGroupIcon} toolTipDesc=""/>
            <div className = 'flex items-center text-gray-500 gap-5'>
                {PRESIDENT_CAND_LEGEND.map(({label, value})=>(
                    <button key = {label} className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setCandView(value)}>
                        <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == value? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                        <div className = 'capitalize'>{label}</div>
                    </button>
                ))}

                <button className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setCandView("compare")}>
                    <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == "compare"? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                    <div className = 'capitalize'>{"Compare"}</div>
                </button>
            </div>
        </div>
    )

    const overlapPct = (!eiAnalysisData || !racialGroup || candView === 'compare')
        ? null
        : computeOverlapPct(
            eiAnalysisData.candidates[PARTY_REFS[candView].key]?.groups[racialGroup]?.density.group,
            eiAnalysisData.candidates[PARTY_REFS[candView].key]?.groups[racialGroup]?.density.complement
        );

    return(
        <GraphView 
            title = {`Ecological Inference (EI) Analysis: Voting Probability`}
            subtitle = { candView == "compare" ? 'Comparison by Candidate':  `Support for ${PARTY_REFS[candView].label}` }
            legendItems = {candView == "compare" ? getCompareColors() : getCandidateColors(racialGroup, candView)}
            menus = {choiceMenu}
            svgRef = {ref}
            extraDisplay={{ label: "Overlap Percentage", data: overlapPct }}
        >
            {error ? <ErrorMsg message={error} />
            : 
            (!racialGroup) && (
                <SelectionPlaceholder 
                    message={`Please select a racial group`} 
                />
            )}
        </GraphView>        
    )
}