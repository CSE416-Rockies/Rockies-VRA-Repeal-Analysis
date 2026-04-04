import {useState, useContext} from 'react'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/solid'
import Tooltip from './Tooltip';
import GlobalStoreContext from '../store';
import { getRaceLabel } from '../utils/helpers';

export default function DropDownMenu({options, onSelect, icon: Icon, minority=false, toolTipDesc}){
    const { store} = useContext(GlobalStoreContext);
    const [open, setOpen] = useState(false);

    const selected = minority ? store.minorityGroup : store.racialGroup;

    /* Display options ---------------------------------------------------------------------------- */
    const defaultText = minority ? "Select minority group" : "Select racial group";
    const displayText = selected || defaultText;
    const chevronIcon = open? < ChevronUpIcon className = 'w-5'/> : < ChevronDownIcon className = 'w-5'/>

    const handleSelect = (option) =>{
        onSelect(option);
        setOpen(false);
    }

    return(
        <div className = 'relative' >
            <div className = 'flex flex-col py-2 relative bg-white shadow-md rounded-xl w-72 text-gray-600'>
                <button className = 'flex items-center justify-between px-5 capitalize text-lg hover:text-gray-400 transition-all duration-100' onClick = {()=>setOpen(!open)}>
                    <div className = 'flex gap-2 items-center'>
                        { Icon && <Icon className = 'w-7'/> }
                        { selected ? getRaceLabel(selected) : displayText }
                    </div>
                    {chevronIcon}
                </button>
                            
                { open && 
                    <ul className = 'absolute top-full bg-white cursor-pointer rounded-xl shadow-md w-full py-2 mt-1'>
                        { options.map((option)=> (
                            <div key = {option.value} className = 'px-5 hover:bg-gray-100 transition-all duration-100 ease-in'>
                                    <li className = 'capitalize p-2' onClick={()=>handleSelect(option.value)}> {option.label} </li>
                            </div> 
                        ))}
                    </ul>
                }
                            
            </div>
            { !selected && !open 
                && <Tooltip desc = {toolTipDesc}/>
            }    
        </div>
    )
}