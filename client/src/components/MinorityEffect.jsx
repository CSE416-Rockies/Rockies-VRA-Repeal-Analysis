import {useEffect, useState, useContext} from "react"
import { FEASIBLE_MINORITIES, ENSEMBLE_LEGEND, BOX_WHISKER_ME_LEGEND } from "../utils/constants"
import { UserGroupIcon } from "@heroicons/react/24/solid";

import DropDownMenu from "./DropDownMenu";
import ThresholdTable from "./ThresholdTable";
import MiniGraphView from "./MiniGraphView";
import { SelectionPlaceholder } from "./SelectionPlaceholder";

import GlobalStoreContext from '../store';
import { getBoxWhiskersME, getEnsembleHistME, getImpactThresholdTable} from "../api/api";
import {drawEnsembleHistME } from "../utils/drawEnsembleHistME";
import { drawBoxWhiskerME } from "../utils/drawBoxWhiskerME";
import ErrorMsg from "./ErrorMsg";

export default function MinorityEffect(){

    const { store, setMinorityGroup } = useContext(GlobalStoreContext);
    const racialGroup = store.minorityGroup;
    const selectedState = store?.selectedState || "";

    const [boxData, setBoxData] = useState(null);
    const [ensembleData, setEnsembleData] = useState(null);
    const [thresholdData, setThresholdData] = useState(null);

    const [boxError, setBoxError] = useState(null);
    const [ensembleError, setEnsembleError] = useState(null);
    const [thresholdError, setThresholdError] = useState(null);

    
    const margin = {top: 30, right: 20, bottom: 40, left: 80}
    
    // state change
    useEffect(() => {
        if (!selectedState) return;
        
        Promise.allSettled([
            getBoxWhiskersME(selectedState),
            getEnsembleHistME(selectedState),
            getImpactThresholdTable(selectedState),
        ]).then(([boxRes, ensembleRes, thresholdRes]) => {
            if (boxRes.status === "fulfilled") setBoxData(boxRes.value.data);
            else setBoxError("Failed to load box whisker data.");

            if (ensembleRes.status === "fulfilled") setEnsembleData(ensembleRes.value.data);
            else setEnsembleError("Failed to load ensemble data.");

            if (thresholdRes.status === "fulfilled") setThresholdData(thresholdRes.value.data);
            else setThresholdError("Failed to load threshold data.");
        }).catch(err => console.error("Error loading data:", err));
    }, [selectedState]);


    return(
        
        <div className = 'flex justify-center items-center w-full h-screen bg-gray-200'>  
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'
                style={{ paddingLeft: 'calc(var(--navbar-width) + 1.25rem)' }}
            >    
                <DropDownMenu  options = {FEASIBLE_MINORITIES[selectedState]} onSelect = {setMinorityGroup} icon={UserGroupIcon} toolTipDesc="" minority = {true}/>
                
                { (!racialGroup) ?
                    <div className = 'w-full h-full rounded-xl bg-white'>
                        <SelectionPlaceholder 
                            message={`Please select a ${!racialGroup ? 'minority group' : ''}`} 
                        /> 
                    </div>
                    
                    : 

                    <div className = 'flex h-full justify-center items-center gap-5'>
                        <div className = "flex flex-col w-full h-full justify-center items-center gap-5">
                            <div className = 'flex w-full gap-5 h-1/2'>
                                <div className = 'flex-1'>
                                    <MiniGraphView 
                                        title = "Minority Effectiveness Distribution by Ensemble Type"
                                        data = {boxData} 
                                        racialGroup = {racialGroup} 
                                        margin = {margin} 
                                        drawFunc = {drawBoxWhiskerME}
                                        legendItems = {BOX_WHISKER_ME_LEGEND}
                                    >
                                        {boxError && <ErrorMsg message={boxError} />}
                                    </MiniGraphView>
                                </div>
                                <div className = 'flex p-5 h-full justify-center items-center gap-5 bg-white rounded-xl'
                                    style = {{width: 'var(--sidebar-width'}}
                                >
                                    {thresholdError ? <ErrorMsg message={thresholdError} /> :
                                    <div className = 'flex flex-col items-center gap-2 justify-center'>
                                        <div className = 'font-semibold text-gray-700'> VRA Impact Threshold Table <span className = 'text-emerald-500 font-bold capitalize'> [{racialGroup}]</span></div>
                                        <ThresholdTable data = {thresholdData} racialGroup = {racialGroup}/>
                                    </div>
                                    }
                                </div>
                            </div>

                            <MiniGraphView 
                                title = {`${racialGroup} Effective District Distribution`} 
                                data = {ensembleData} 
                                racialGroup = {racialGroup}
                                margin = {margin} 
                                drawFunc = {drawEnsembleHistME}
                                legendItems = {ENSEMBLE_LEGEND['both']}
                            >
                                {ensembleError && <ErrorMsg message={ensembleError} />}
                            </MiniGraphView>
                        </div>
                    
                </div>
               
                }
                
                
                
                
            </div>
        </div> 
    
    )
}
