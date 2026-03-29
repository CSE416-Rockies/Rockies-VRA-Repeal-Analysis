import {useEffect, useState, useContext} from "react"
import { MINORITIES, ENSEMBLE_LEGEND, BOX_WHISKER_ME_LEGEND } from "../utils/constants"
import { UserGroupIcon } from "@heroicons/react/24/solid";

import DropDownMenu from "./DropDownMenu";
import ThresholdTable from "./ThresholdTable";
import MiniGraphView from "./MiniGraphView";


import GlobalStoreContext from '../store';
import { getBoxWhiskersME, getEnsembleHistME } from "../api/api";
import {drawEnsembleHistME } from "../utils/drawEnsembleHistME";
import { drawBoxWhiskerME } from "../utils/drawBoxWhiskerME";

export default function MinorityEffect(){

    const { store, setRacialGroup } = useContext(GlobalStoreContext);
    const racialGroup = store.racialGroup;
    const selectedState = store?.selectedState || "";

    const [boxData, setBoxData] = useState(null);
    const [ensembleData, setEnsembleData] = useState(null);
    
    const margin = {top: 20, right: 20, bottom: 40, left: 80}
    
    // state change
    useEffect(() => {
        if (!selectedState) return;
        Promise.all([
            getBoxWhiskersME(selectedState),
            getEnsembleHistME(selectedState),
        ]).then(([boxRes, ensembleRes]) => {
            setBoxData(boxRes.data);
            setEnsembleData(ensembleRes.data);
        }).catch(err => console.error("Error loading data:", err));
    }, [selectedState]);


    return(
        
        <div className = 'flex justify-center items-center w-full h-screen bg-gray-200'>  
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'
                style={{ paddingLeft: 'calc(var(--navbar-width) + 1.25rem)' }}
            >    
                <DropDownMenu  options = {MINORITIES} onSelect = {setRacialGroup} icon={UserGroupIcon} toolTipDesc=""/>
                <div className = 'flex h-full justify-center items-center gap-5'>
                    <div className = "flex flex-col flex-1 h-full justify-center items-center gap-5">
                        <MiniGraphView 
                            title = "Minority Effectiveness Distribution by Ensemble Type"
                            data = {boxData} 
                            racialGroup = {racialGroup} 
                            margin = {margin} 
                            drawFunc = {drawBoxWhiskerME}
                            legendItems = {BOX_WHISKER_ME_LEGEND}
                        />
                        <MiniGraphView 
                            title = {`${racialGroup} Effective District Distribution`} 
                            data = {ensembleData} 
                            racialGroup = {racialGroup}
                            margin = {margin} 
                            drawFunc = {drawEnsembleHistME}
                            legendItems = {ENSEMBLE_LEGEND}
                        />
                    </div>
                    

                    <div className = 'flex flex-col p-5 h-full justify-center items-center gap-5 bg-white rounded-xl'
                        style = {{width: 'var(--sidebar-width'}}
                    >
                        <div className = 'flex flex-col items-center gap-2'>
                            <div> VRA Impact Threshold Table <span className = 'text-emerald-500 font-bold'> [{racialGroup}]</span></div>
                            <ThresholdTable/>
                        </div>

                        <div className = 'flex flex-col items-center gap-2'>
                            <> General Minority VRA Threshold Table</>
                            <ThresholdTable/>
                        </div>
                        
                    </div>
                </div>
               
                
            </div>
        </div> 
    
    )
}
