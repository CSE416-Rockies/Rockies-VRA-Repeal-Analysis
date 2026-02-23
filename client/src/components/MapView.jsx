import { useState } from "react"

import StateDetail from './StateDetail.jsx';
import DistrictDetail from './DistrictDetail.jsx';

export default function MapView(){
    const [expanded, setExpanded] = useState(true);

    return(

        <div className = 'flex fixed inset-0 h-screen w-full'>

   
            <div className = 'flex flex-col absolute gap-5 w-1/3 my-5 top-40 right-5'>
                <StateDetail expanded = {expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute top-0 '/>
                <DistrictDetail expanded = {!expanded} onClick = {()=>setExpanded(!expanded)} className = 'absolute bottom-0 '/>
            </div>
            
        </div>
    )

    
}