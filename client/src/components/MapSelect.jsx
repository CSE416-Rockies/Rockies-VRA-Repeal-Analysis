import { useContext} from 'react'
import DropDownMenu from './DropDownMenu.jsx';

import GlobalStoreContext from '../store/index.jsx';
import { MINORITIES } from '../utils/constants.js';
import { UserGroupIcon } from '@heroicons/react/24/solid';

export default function MapSelect(){
    const { store, setMapMode, setMinorityGroup } = useContext(GlobalStoreContext);

    const options = [{id: 'district',  label: 'District plan'}, {id: 'precinct', label: 'Precinct'}]

    const handleToggle = (mode) => {
        setMinorityGroup(null);
        setMapMode(mode);
    }


    function handleSelect(option){
        setMinorityGroup(option);
    }



    return(
        <div className = 'flex items-center z-40 absolute top-5 gap-5 text-gray-500 pointer-events-auto'
             style={{ left: 'calc(var(--navbar-width) + var(--panel-padding))'}}
        >
            <div className = 'flex items-center gap-5 bg-white rounded-xl px-5 shadow-md'>
                { options.map(({id, label})=>(
                    <button key = {id} className = 'flex gap-2 text-lg py-2 items-center cursor-pointer group' onClick = {()=> handleToggle(id)}>
                        <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${store.mapMode == id? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                        {label}
                    </button>
                ))
                }
            </div>

            { store.mapMode == 'precinct' &&  <DropDownMenu options = {MINORITIES} icon = {UserGroupIcon} onSelect={handleSelect} toolTipDesc="Select group to show population" /> }
        </div>
    )
}