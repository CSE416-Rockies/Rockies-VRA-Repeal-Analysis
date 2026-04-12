import { useState, useEffect, useContext} from 'react'
import GlobalStoreContext from "../store";
import { UserGroupIcon } from '@heroicons/react/24/solid';
 
import DropDownMenu from './DropDownMenu';
import MiniGraphView from './MiniGraphView';
import { SelectionPlaceholder } from './SelectionPlaceholder';

import { drawBoxWhisker } from "../utils/drawBoxWhisker";
import drawEnsembleSplits from "../utils/drawEnsembleSplits";
import { BOX_WHISKER_ME_LEGEND, ENSEMBLE_LEGEND, RACES, ENSEMBLE_VIEW_OPTIONS } from '../utils/constants';

import { getBoxWhiskers, getEnsembleSplits } from '../api/api';


export default function Ensemble(){
    const { store, setRacialGroup, setEnsemble} = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const racialGroup = store.racialGroup;
    const ensemble = store.ensemble;

    const margin = {top: 20, right: 20, bottom: 60, left: 80};

    const [boxWhiskerData, setBoxWhiskerData] = useState(null);
    const [ensembleSplitsData, setEnsembleSplitsData] = useState(null);    

     // state change
    useEffect(() => {
        if (!selectedState) return;
        
        Promise.allSettled([
            getBoxWhiskers(selectedState),
            getEnsembleSplits(selectedState),
        ]).then(([boxRes, ensembleRes]) => {
            if (boxRes.status == "fulfilled") setBoxWhiskerData(boxRes.value.data);
            if (ensembleRes.status == "fulfilled") setEnsembleSplitsData(ensembleRes.value.data);
        }).catch(err => console.error("Error loading data:", err));
        
    }, [selectedState]);


    const choiceMenu = 
        <div className = 'flex gap-5 items-center'>
            <DropDownMenu options = {RACES} onSelect = {setRacialGroup} icon = {UserGroupIcon} toolTipDesc=""/>
            <div className = 'flex items-center text-gray-500 gap-5'>
                {ENSEMBLE_VIEW_OPTIONS.map(({value, label})=>(
                    <button key = {value} className = 'flex gap-2 text-lg items-center cursor-pointer group' onClick = {() => setEnsemble(value)}>
                        <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${ensemble == value? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                        <div className = 'capitalize'>{label}</div>
                    </button>
                ))}
            </div>
        </div>


    return(

        <div className = 'flex justify-center items-center w-full h-screen bg-gray-200'>  
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'
                style={{ paddingLeft: 'calc(var(--navbar-width) + 1.25rem)' }}
            >    
                {choiceMenu}

                <div className = 'flex h-full justify-center items-center gap-5'>
                    {(!racialGroup || !ensemble) ? 
                        <div className = 'w-full h-full bg-white rounded-xl'>
                            <SelectionPlaceholder 
                                message={`Please select a ${!ensemble ? 'district ensemble' : ''}${!ensemble && !racialGroup ? ' and ' : ''}${!racialGroup ? 'racial group' : ''}`} 
                            />
                        </div>
                    :
                   
                    <div className = "flex flex-col flex-1 h-full justify-center items-center gap-5">
                        <MiniGraphView 
                            title = {`${racialGroup} Population Share`}
                            data = {boxWhiskerData} 
                            racialGroup = {racialGroup} 
                            margin = {margin} 
                            drawFunc = {drawBoxWhisker}
                            legendItems = {BOX_WHISKER_ME_LEGEND}
                            extraProps={{ensemble}}
                        />
                            
                        <MiniGraphView 
                            title={`Ensemble Splits for ${racialGroup} `}
                            data = {ensembleSplitsData} 
                            racialGroup = {racialGroup}
                            margin = {margin} 
                            drawFunc = {drawEnsembleSplits}
                            legendItems = {ENSEMBLE_LEGEND}
                            extraProps={{ensemble}}
                        />
                    </div>
                    }
                </div>
               
                
            </div>
        </div> 
        
        
    )

}

