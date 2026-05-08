import {useRef, useState, useEffect, useContext} from 'react'

import DropDownMenu from './DropDownMenu';
import GlobalStoreContext from "../store";
import GraphView from './GraphView';
import { SelectionPlaceholder } from './SelectionPlaceholder';
import { UserGroupIcon } from '@heroicons/react/24/solid';

import { drawEIAnalysis } from '../utils/drawEIAnalysis';
import { useD3 } from '../hooks/useD3';
import { RACES, PRESIDENT_CAND_LEGEND, PARTY_REFS, getCandidateColors, getCompareColors } from "../utils/constants"

import { getEIAnalysis } from '../api/api';
import ErrorMsg from './ErrorMsg';
import { toPercent } from '../utils/helpers';


export default function EIAnalysis(){
    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const racialGroup = store.racialGroup;

    const [candView, setCandView] = useState('dem');
    const [compareRace, setCompareRace] = useState(null);
    const [eiAnalysisData, setEIAnalysisData] = useState(null); 
    const [error, setError] = useState(null);


    const ref = useRef(null);
    const margin = {top: 40, right: 20, bottom: 60, left: 80};

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

    // reset overlap race
    const handleRaceSelect = (val) => {
        setRacialGroup(val);
        setCompareRace(null);
    }


    // draw d3 
    useD3(ref, (svg)=>{
        if(!eiAnalysisData || !racialGroup|| !ref.current) return;
        drawEIAnalysis({ givenSVG: svg, data: eiAnalysisData, margin, racialLabel: racialGroup, candView, compareRace });
    }, [eiAnalysisData, candView, racialGroup, compareRace]);
    

    const choiceMenu = (
        <div className = 'flex gap-5 items-center'>
            <DropDownMenu options = {RACES} onSelect = {handleRaceSelect} icon = {UserGroupIcon} toolTipDesc=""/>
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

    const extraMenu = (candView !== 'compare' && racialGroup) ? (
        <div className='flex flex-col gap-2 border border-gray-300 rounded-md px-3 py-2 w-32'>
            <div className='text-sm text-gray-400'>COMPARE: </div>
            <div className='flex flex-col gap-2'>
                {RACES.filter(r => r.value !== racialGroup).map(({ label, value }) => (
                    <button 
                        key={value} 
                        className='flex gap-1 text-sm items-center cursor-pointer group'
                        onClick={() => setCompareRace(value === compareRace ? null : value)}
                    >
                        <div className={`rounded-md border-2 w-4 h-4 border-gray-500 ${compareRace === value ? 'bg-gray-500' : 'group-hover:bg-gray-300'}`} />
                        <div className='capitalize'>{label}</div>
                    </button>
                ))}
            </div>
        </div>
    ) : null;

    const overlapPct = (!eiAnalysisData || !racialGroup || candView === 'compare' || !compareRace)
        ? null
        : toPercent(eiAnalysisData.candidates[PARTY_REFS[candView].key]?.groups[racialGroup]?.overlap[compareRace]);

    return(
        <GraphView 
            title = {`Ecological Inference (EI) Analysis: Voting Probability`}
            subtitle = { candView == "compare" ? 'Comparison by Candidate':  `Support for ${PARTY_REFS[candView].label} Party` }
            legendItems = {candView == "compare" ? getCompareColors() : getCandidateColors(racialGroup, compareRace, candView).slice(0, compareRace ? 2 : 1)}
            menus = {choiceMenu}
            svgRef = {ref}
            extraDisplay={{ label: "Overlap", data: overlapPct }}
            extraMenu = {extraMenu}
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