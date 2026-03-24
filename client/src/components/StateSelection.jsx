import { XCircleIcon } from '@heroicons/react/24/solid'
// import { useParams } from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react';
import GlobalStoreContext from '../store';
import StateDropdown from './StateDropdown';
import { getStateSummary, getRepresentatives } from '../api/api';

export default function StateSelection({ onClose }){
    const location = useLocation();
    const ref = useRef(null);

    const isMapView = (location.pathname.startsWith("/map"));
    const isGraph = ((location.pathname !== "/") && !isMapView);
    const [ensembleData, setEnsembleData] = useState(null);

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
            getStateSummary(selectedState)
                .then(res => {
                    console.log("Data from server:", res.data);
                    setEnsembleData(res.data);
                })
                .catch(err => console.log(err))
            getRepresentatives(selectedState)
                .then((res) => setRepresentatives(res.data.sort((a, b) => a.districtNumber - b.districtNumber)))
                .catch((err)=>console.log("Error loading district detail: ", err));
        }
        
    },[selectedState]);

    const options = [{id: 'Delaware', label: 'Delaware'}, {id: 'Georgia',  label: 'Georgia'}]

    return(

        <div ref={ref} className = "fixed right-5 top-5 z-50 flex flex-col bg-white rounded-2xl shadow-md w-1/3 pt-4 border-divide">

            <div className = "flex justify-between items-center pb-4 px-4 text-xl w-full relative">
                <span className = 'flex gap-2'>
                    <span className = "text-gray-500">{selectedState ? 'Selected:' : 'Select a State:'}</span>
                    
                    {selectedState && (<span className = "font-bold">{selectedState}</span>)}
                </span>
                {(!selectedState || isGraph) && <StateDropdown options={options} onSelect={(state)=> setSelectedState(state)} />}
                {selectedState && !isGraph && <XCircleIcon className = 'cursor-pointer text-red-500 w-7 transition-transform duration-500 ease-in-out hover:scale-125'
                onClick={backToMap}
                />}
            </div>
            { isMapView && 
                <div className = "flex justify-between divide-x divide-gray-300">
                    <div className = "px-4 pt-2 pb-4 flex-1">
                        <div className = "font-bold text-lg text-gray-500">Race-Blind</div>
                        <div className = "text-gray-500 text-sm">District Plans: {ensembleData ? ensembleData.raceBlindPlans: '-'}</div>
                        <div className = "text-gray-500 text-sm">Population Threshold: ±{ensembleData ? ensembleData.raceBlindThreshold: '-'}%</div>
                    </div>


                    <div className = "px-4 pt-2 flex-1">
                        <div className = "font-bold text-lg text-gray-500">VRA</div>
                        <div className = "text-gray-500 text-sm">District Plans: {ensembleData ? ensembleData.vraPlans: '-'}</div>
                        <div className = "text-gray-500 text-sm">Population Threshold: ±{ensembleData ? ensembleData.vraThreshold: '-'}%</div>
                    </div>
                </div>
                }
            
        </div>
    )
}