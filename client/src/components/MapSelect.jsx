import { useContext} from 'react'
import DropDownMenu from './DropDownMenu.jsx';

import GlobalStoreContext from '../store/index.jsx';
import { MINORITIES } from '../utils/constants.js';

export default function MapSelect(){
    const { store, setMapMode } = useContext(GlobalStoreContext);

    const options = [{id: 'district',  label: 'District plan'}, {id: 'precinct', label: 'Precinct'}]

    const handleToggle = (mode) => {
        setMapMode(mode);
    }

    return(
        <div className = 'flex items-center z-40 absolute top-5 left-24 gap-5 text-gray-500 pointer-events-auto'>
            <div className = 'flex items-center gap-5'>
                { options.map(({id, label})=>(
                    <button key = {id} className = 'flex gap-2 text-lg py-3 items-center cursor-pointer group' onClick = {()=> handleToggle(id)}>
                        <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${store.mapMode == id? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                        {label}
                    </button>
                ))
                }
            </div>

            { store.mapMode == 'precinct' &&  <DropDownMenu options = {MINORITIES}/> }
        </div>
    )
}