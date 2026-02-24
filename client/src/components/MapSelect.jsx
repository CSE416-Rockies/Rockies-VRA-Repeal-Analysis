import {useState} from 'react'
import DropDownMenu from './DropDownMenu.jsx';

export default function MapSelect(){

    const minorities = ['asian', 'black', 'latino', 'other'];
    const [selectMap, setSelectMap] =  useState('district');


    const options = [{id: 'district',  label: 'District plan'}, {id: 'precinct', label: 'Precinct'}]

    return(
        <div className = 'flex z-40 absolute top-5 left-24 gap-5 text-gray-500 pointer-events-auto'>
            <div className = 'flex items-center gap-5'>
                { options.map(({id, label})=>(
                    <button key = {id} className = 'flex gap-2 text-lg py-3 items-center cursor-pointer group' onClick = {()=> setSelectMap(id)}>
                        <div className = {`rounded-md border-2 w-5 h-5 border-gray-500 capitalize ${selectMap == id? 'bg-gray-500 ': 'group-hover:bg-gray-300'}`}>  </div>
                        {label}
                    </button>
                ))
                }
            </div>

            { selectMap == 'precinct' &&  <DropDownMenu options = {minorities}/> }
        </div>
    )
}