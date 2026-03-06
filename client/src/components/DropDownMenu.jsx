import {useState, useContext, useEffect} from 'react'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/solid'
import {useLocation} from 'react-router-dom';
import Tooltip from './Tooltip';
import GlobalStoreContext from '../store';


export default function DropDownMenu({options, onSelect, icon: Icon, text, toolTipDesc}){
        const { store } = useContext(GlobalStoreContext);
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState(null);

        const location = useLocation();
        const isMapView = (location.pathname.startsWith("/map"));

        const chevronIcon = open? < ChevronUpIcon className = 'w-5'/> : < ChevronDownIcon className = 'w-5'/>

        function selectFunc(option) {
                setSelected(option);
                onSelect(option);
                setOpen(false);
        }

        useEffect(() =>{
                if(isMapView) setSelected(store.minorityGroup);
        },[isMapView, setSelected]);

        const defaultText = (isMapView)?( store.minorityGroup ? store.minorityGroup : "Select minority group" ): "Select racial group";
        const displayText = selected || text || defaultText;

        return(
        
        <div className = 'relative'>
                <div className = 'flex flex-col py-2 relative bg-white shadow-md rounded-xl w-72 text-gray-600'>

                        <button className = 'flex items-center justify-between px-5 capitalize text-lg hover:text-gray-400 transition-all duration-100' onClick = {()=>setOpen(!open)}>
                                <div className = 'flex gap-2 items-center'>
                                        { Icon && <Icon className = 'w-7'/> }
                                        { selected ? selected : displayText }
                                </div>
                                {chevronIcon}
                        </button>
                        
                        { open && 
                        <ul className = 'absolute top-full bg-white cursor-pointer rounded-xl shadow-md w-full py-2'>
                        { options.map((option)=> (
                                <div key = {option} className = 'px-5 hover:bg-gray-100 transition-all duration-100 ease-in'>
                                        <li className = 'capitalize p-2' onClick = {()=>selectFunc(option)}> {option} </li>
                                </div> 
                        ))}
                        </ul>
                        }

                        
                </div>
                { !selected && !open &&
                        <Tooltip desc = {toolTipDesc}/>
                }
                
        </div>


        )
}