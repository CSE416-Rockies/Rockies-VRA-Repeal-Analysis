import {useRef, useState, useContext} from 'react'
import DropDownMenu from './DropDownMenu';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import GlobalStoreContext from "../store";
import Legend from './Legend';

import { RACES, PRESIDENT_CAND_LEGEND } from "../utils/constants"


export default function EIAnalysis(){
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [racialGroup, setRacialGroup] = useState('white'); 
    const [candView, setCandView] = useState('trump'); 

    const ref = useRef(null);


    return(
        <div className = 'flex justify-center items-center w-full h-full bg-gray-200'>    
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'>    
                <div className = 'flex gap-5 text-gray-500 items-center'>
                    <DropDownMenu options = {RACES} onSelect = {setRacialGroup} icon = {UserGroupIcon}/>
                    <div className = 'flex items-center gap-5'>
                        {PRESIDENT_CAND_LEGEND.map(({label})=>(
                                <button key = {label} className = 'flex gap-2 text-lg py-3 items-center cursor-pointer group' onClick = {() => setCandView(label)}>
                                    <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${candView == label? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                                    <div className = 'capitalize'>{label}</div>
                                </button>
                        ))}
                    </div>
                </div>
                <div className = 'flex flex-col w-full h-full px-15 py-10 justify-center items-center gap-5 bg-white rounded-xl'>
                    <div className = 'flex flex-col gap-5 justify-center items-center'>
                        <div className = 'text-3xl'>2024 Presidential Election EI Analysis [{selectedState}]</div>
                        <div className = 'text-xl capitalize'>Support for {candView}</div>
                    </div>
                    <div className = 'flex w-full h-full px-20 items-center justify-between'>
                        <svg className = 'flex-1' width = "100%" height = "100%" ref = {ref} />
                        <Legend title = "Racial Group" 
                                items = {[
                                        {label: racialGroup, color: "#10B981"},
                                        {label: `Not ${racialGroup}`, color: "#D1FAE5"}
                                ]}/>
                    </div>
                </div>
            </div>
        </div>
        
    )
}