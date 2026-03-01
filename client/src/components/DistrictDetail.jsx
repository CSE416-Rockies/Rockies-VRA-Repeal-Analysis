import {ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import PageControls from './PageControls';

import { usePaginate } from '../hooks/paginate';
import { useEffect, useRef, useState } from 'react';

export default function DistrictDetail({expanded, onClick}){
    const theadRef = useRef(null);
    const rowRef = useRef(null);
    const pageRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const [perPage, setPerPage] = useState(7);

    useEffect(()=>{
        if(!expanded) return;
        // console.log("in expanded, calculating perpage");

        const calculate = () =>{
            // console.log("running caluclate()");
            // console.log("containerRef.current:", containerRef.current.clientHeight);
            // console.log("theadRef.current:", theadRef.current.clientHeight);
            // console.log("rowRef.current:", rowRef.current.clientHeight);
            // console.log("pageRef.current.clientHeight:", pageRef.current.clientHeight);
            if(containerRef.current && theadRef.current && rowRef.current && pageRef.current && titleRef.current){
                const header_height = theadRef.current.clientHeight;
                const title_height = titleRef.current.clientHeight;
                const row_height = rowRef.current.clientHeight;
                const page_height = pageRef.current.clientHeight
                const padding = 20;
                const gap = 20;
                const outerPadding = 40;
                const available = containerRef.current.clientHeight - page_height - title_height - header_height - padding - gap;
                const rows = Math.max(1, Math.floor(available / row_height));
                setPerPage(rows);
                // console.log("rows per page: ", rows);
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
    
    const districtArr = [
        {dNum: 1, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 2, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 3, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 4, rep: "Jane Doe", party: "democrat", racialGroup: "black", voteMargin: 30.81},
        {dNum: 5, rep: "Jane Doe", party: "republican", racialGroup: "other", voteMargin: 30.81},
        {dNum: 6, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 8, rep: "Jane Doe", party: "democrat", racialGroup: "black", voteMargin: 30.81},
        {dNum: 9, rep: "Jane Doe", party: "republican", racialGroup: "black", voteMargin: 30.81},
        {dNum: 10, rep: "Jane Doe", party: "democrat", racialGroup: "white", voteMargin: 30.81},
        {dNum: 11, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 12, rep: "Jane Doe", party: "republican", racialGroup: "latino", voteMargin: 30.81},
        {dNum: 13, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 14, rep: "Jane Doe", party: "republican", racialGroup: "latino", voteMargin: 30.81}
    ];

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
                        {onPage.map(({dNum, rep, party, racialGroup, voteMargin}, index) => (
                        <tr key = {dNum} ref={index === 0 ? rowRef : null} className = {`h-8 ${index%2==0? 'bg-gray-100':''}`} >
                                <td className = 'pl-5'>{dNum}</td>
                                <td>{rep}</td>
                                <td >
                                    <span className = {`text-xs rounded-sm p-1 font-bold text-white ${party == "democrat"? 'bg-blue-500' : 'bg-red-500'} w-8 inline-flex justify-center`}>
                                        {party == 'democrat'? 'DEM':'REP'}
                                    </span>                    
                                </td>
                                <td>{racialGroup}</td>
                                <td>{voteMargin}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <PageControls ref={pageRef} currPage = {currPage} prev = {goPrev} next = {goNext} hasPrev = {hasPrev} hasNext = {hasNext} />
            </div>
            
        </div>
    )

}