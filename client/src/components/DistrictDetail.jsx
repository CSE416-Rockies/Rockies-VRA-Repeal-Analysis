import {ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import PageControls from './PageControls';

import { usePaginate } from '../hooks/paginate';
import { useEffect, useRef, useState, useContext } from 'react';
import GlobalStoreContext from '../store';

export default function DistrictDetail({expanded, onClick}){
    const theadRef = useRef(null);
    const rowRef = useRef(null);
    const pageRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const [perPage, setPerPage] = useState(7);
    const [districtArr, setDistrictArr] = useState([]);

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";


    useEffect(() => {
        if(!selectedState) return;

        fetch(`/representatives/Representatives.json`)
            .then((res) => res.json())
            .then((data) => {
                const stateData = data.find(e=>e.state === selectedState);
                setDistrictArr(stateData? stateData.representatives: [])
            })
            .catch((err) => console.error("Error loading representative json:", err));
    }, [selectedState]);

    useEffect(()=>{
        if(!expanded) return;
        // console.log("in expanded, calculating perpage");

        const calculate = () =>{
            if(containerRef.current && theadRef.current && rowRef.current && pageRef.current && titleRef.current){
                const header_height = theadRef.current.clientHeight;
                const title_height = titleRef.current.clientHeight;
                const row_height = rowRef.current.clientHeight;
                const page_height = pageRef.current.clientHeight
                const padding = 20;
                const gap = 20;
                const available = containerRef.current.clientHeight - page_height - title_height - header_height - padding - gap;
                const rows = Math.max(1, Math.floor(available / row_height));
                setPerPage(rows);
            }
        }
        const timeout = setTimeout(calculate, 700);
        const observer = new ResizeObserver(calculate);
        if(containerRef.current) observer.observe(containerRef.current);
        return ()=>{
            clearTimeout(timeout);
            observer.disconnect();
        }
    }, [expanded]);

    const {onPage, currPage, goPrev, goNext, hasPrev, hasNext, _ } = usePaginate(districtArr, perPage);
    
    return(

        <div ref={containerRef} className = 'bg-white rounded-2xl shadow-md flex flex-col w-full py-4 text-sm overflow-hidden min-h-0 transition-all duration-700 ease-in-out' 
             style={{ flex: expanded ? 1 : '0 0 auto'}}
        >
            <div ref={titleRef} className = 'flex bg-white w-full justify-between text-xl px-5 text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>District Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>
        
            <div className={`flex flex-col justify-center items-center gap-5 overflow-y-auto ${expanded ? 'opacity-100 pt-5' : 'max-h-0 opacity-0'}`}>
                <table className = 'w-full'>
                    <thead className = 'text-left text-gray-400 ' ref={theadRef}>
                        <tr>
                            <th className = 'pl-5'>#</th>
                            <th>Representative</th>
                            <th>Party</th>
                            <th>Racial Group</th>
                            <th >Vote Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {onPage.map(({district_number, name, party, racial_ethnic_group, vote_margin_percent, status}, index) => (
                        <tr key = {district_number} ref={index === 0 ? rowRef : null} className = {`h-8 ${index%2==0? 'bg-gray-100':''} ${status == "Vacant" ? 'text-gray-400' : ''}`} >
                                <td className = 'pl-5'>{district_number}</td>
                                <td>{name ?? "Vacant"}</td>
                                <td >
                                    {party ?
                                    (<span className = {`text-xs rounded-sm p-1 font-bold text-white ${party == "Democratic"? 'bg-blue-500' : 'bg-red-500'} w-8 inline-flex justify-center`}>
                                        {party == 'Democratic'? 'DEM':'REP'}
                                    </span>):'-'}                    
                                </td>
                                <td>{racial_ethnic_group ?? "-"}</td>
                                <td>{vote_margin_percent ?? "-"}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <PageControls ref={pageRef} currPage = {currPage} prev = {goPrev} next = {goNext} hasPrev = {hasPrev} hasNext = {hasNext} />
            </div>
            
        </div>
    )

}