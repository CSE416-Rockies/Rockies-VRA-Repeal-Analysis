import { XCircleIcon } from '@heroicons/react/24/solid'
import { useParams } from 'react-router-dom'
import { useContext } from 'react';
import GlobalStoreContext from '../store';

export default function StateSelection({ onClose }){
    const {name} = useParams();
    // console.log("state name: ", name);

    const { setSelectedState, setMapMode } = useContext(GlobalStoreContext);
    
    const backToMap = () => {
        setSelectedState(null);
        setMapMode('district');
        onClose();
    };

    return(

        <div className = "fixed right-5 top-5 z-50 flex flex-col bg-white rounded-2xl shadow-md w-1/3 pt-4 border-divide">

            <div className = "flex justify-between items-center pb-4 px-4 text-xl">
                <span className = 'flex gap-2'>
                    <span className = "text-gray-400">Selected:</span>
                    <span className = "font-bold">{name}</span>
                </span>
                {name && <XCircleIcon className = 'cursor-pointer text-red-500 w-7 transition-transform duration-500 ease-in-out hover:scale-125'
                onClick={backToMap}
                />}
            </div>

            <div className = "flex justify-between divide-x divide-gray-300">
                <div className = "px-4 pt-4 pb-4">
                    <div className = "text-gray-400 text-xs">DISTRICT PLANS</div>
                    <div className = "font-bold text-lg">{name ? (name == 'Georgia' ? 25 : 15): '-'}</div>
                </div>

                <div className = "px-4 pt-4">
                    <div className = "text-gray-400 text-xs">POPULATION THRESHOLD</div>
                    <div className = "font-bold text-lg">{name ? (name == 'Georgia' ? 15 : 10): '-'}%</div>
                </div>
            </div>
            
        </div>
    )
}