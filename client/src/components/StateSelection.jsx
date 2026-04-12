import { XCircleIcon } from '@heroicons/react/24/solid'
import {useLocation} from 'react-router-dom'
import { useContext, useEffect, useRef } from 'react';
import GlobalStoreContext from '../store';

import StateDropdown from './StateDropdown';
import {STATE_OPTIONS} from "../utils/constants";
import { getRepresentatives } from '../api/api';

export default function StateSelection({ onClose }){
    const location = useLocation();
    const ref = useRef(null);

    const isMapView = (location.pathname.startsWith("/map"));
    const isGraph = ((location.pathname !== "/") && !isMapView);

    const { store, setSelectedState, setMapMode, setRepresentatives } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    
        
    const backToMap = () => {
        setSelectedState(null);
        setMapMode('district');
        onClose();
    };

    // read height of stateselection
    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(() => {
            if (!ref.current) return;
            document.documentElement.style.setProperty(
                '--state-selection-height',
                `${ref.current.offsetHeight}px`
            );
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []); 

    useEffect(()=>{
        if(selectedState){
            getRepresentatives(selectedState)
                .then((res) => setRepresentatives(res.data.sort((a, b) => a.districtNumber - b.districtNumber)))
                .catch((err)=>console.log("Error loading district detail: ", err));
        }
        
    },[selectedState]);

    return(

        <div ref={ref} 
            className = "fixed right-5 top-5 z-40 flex flex-col bg-white rounded-2xl shadow-md pt-4 border-divide"
            style = {{width: 'var(--sidebar-width)' }}
        >

            <div className = "flex justify-between items-center pb-4 px-4 w-full relative text-xl">
                <span className = 'flex gap-2'>
                    <span className = "text-gray-500">{selectedState ? 'Selected:' : 'Select a State:'}</span>
                    
                    {selectedState && (<span className = "font-bold">{selectedState}</span>)}
                </span>
                {(!selectedState || isGraph) && <StateDropdown options={STATE_OPTIONS} onSelect={(state)=> setSelectedState(state)} />}
                {selectedState && !isGraph && <XCircleIcon className = 'cursor-pointer text-red-500 w-7 transition-transform duration-500 ease-in-out hover:scale-125'
                onClick={backToMap}
                />}
            </div>
            
        </div>
    )
}