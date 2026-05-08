import { Fragment } from 'react';

import PageControls from './PageControls';
import DetailPanel from './DetailPanel';
import DistrictRowExpandPanel from './DistrictRowExpandPanel';

import { usePaginate } from '../hooks/usePaginate';
import { useEffect, useRef, useState, useContext } from 'react';
import GlobalStoreContext from '../store';
import { PARTY_COLORS } from '../utils/constants';
import { normalizeParty } from '../utils/helpers';
import { getDistrictScores } from '../api/api';

export default function DistrictDetail({expanded, onClick, selectedDistrict, onSelect}){
    const theadRef = useRef(null);
    const rowRef = useRef(null);
    const pageRef = useRef(null);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const [perPage, setPerPage] = useState(7);
    const [scores, setScores] = useState(null);

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const districtArr = store?.representatives || [];

    useEffect(() => {
        getDistrictScores(selectedState)
            .then(res => setScores(res.data))
            .catch(console.error)
    }, [selectedState]);

    useEffect(()=>{
        if(!expanded) return;

        const calculate = () =>{
            if(containerRef.current && theadRef.current && rowRef.current && pageRef.current && titleRef.current){
                const header_height = theadRef.current.clientHeight;
                const title_height = titleRef.current.clientHeight;
                const row_height = rowRef.current.clientHeight;
                const page_height = pageRef.current.clientHeight
                const padding = 30;
                const gap = 30;
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

    const effectivePerPage = selectedDistrict ? perPage - 3 : perPage;
    const {onPage, currPage, goPrev, goNext, hasPrev, hasNext, goToSpecific } = usePaginate(districtArr, effectivePerPage);

    useEffect(()=>{
        if(!selectedDistrict) return;
        goToSpecific(selectedDistrict-1);
    }, [selectedDistrict]);

    const selectedRowRef = useRef(null);
    const [pfp, setPfp] = useState(0);
    const isOnCurrentPage = onPage.some(r => String(r.districtNumber) === selectedDistrict);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (selectedRowRef.current && containerRef.current) {
                const rowRect = selectedRowRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                setPfp(rowRect.top - containerRect.top - 50);     
            }
        }, 50);
        return () => clearTimeout(timeout);
    }, [selectedDistrict]);

    return(

        <DetailPanel title="District Detail" expanded={expanded} onClick={onClick} className="pt-4" containerRef={containerRef} titleRef = {titleRef}>
            
            <div className={`flex flex-col relative flex-1 justify-between items-center gap-5 ${expanded ? 'opacity-100 pt-5' : 'max-h-0 opacity-0'}`}>
               {selectedDistrict && isOnCurrentPage && (
                    <img
                        src={`/imgs/representatives/${districtArr.find(r => String(r.districtNumber) === selectedDistrict)?.imageId}.jpg`}
                        className="absolute w-20 h-24 object-cover shadow transition-all duration-300 bg-white p-1 rounded-md"
                        style={{ top: pfp, left: '-90px'}}
                        onError={e => e.target.style.display = 'none'}
                    />
                )}
                <table className = 'w-full'>
                    <thead className = 'text-left text-gray-400' ref={theadRef}>
                        <tr>
                            <th className = 'pl-5'>#</th>
                            <th>Representative</th>
                            <th>Party</th>
                            <th>Racial Group</th>
                            <th >Vote Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {onPage.map(({districtNumber, name, party, racialEthnicGroup, voteMarginPercent, status}, index) => {
                        console.log('selectedDistrict:' + typeof(selectedDistrict) );
                        return(<Fragment key={districtNumber}>
                        <tr 
                            ref={String(districtNumber) === selectedDistrict ? selectedRowRef : (index === 0 ? rowRef : null)}
                            onClick = {()=> onSelect(districtNumber)}
                            className = {`
                                h-8 cursor-pointer hover:text-emerald-500 hover:font-semibold
                                ${status === "Vacant" ? 'text-gray-400' : ''} 
                                ${String(districtNumber) === (selectedDistrict) ? 'text-gray-700 font-bold' : ''}
                                ${selectedDistrict && String(districtNumber) !== selectedDistrict ? 'bg-gray-100' : ''}
                                ${!selectedDistrict && index % 2 === 0 ? 'bg-gray-100' : ''}


                                `}
                        >
                            <td className={`pl-5 ${String(districtNumber) === selectedDistrict ? 'border-l-2 border-emerald-400' : ''}`}>
                                {districtNumber}
                            </td>
                            <td> {name ?? "Vacant"}</td>
                            <td >
                                {party && name !== "Vacant"?
                                (<span className = {`text-xs rounded-sm p-1 font-bold text-white w-8 inline-flex justify-center`}
                                        style = {{backgroundColor: PARTY_COLORS[normalizeParty(party)] }}>
                                    {party == 'Democratic'? 'DEM':'REP'}
                                </span>):'-'}                    
                            </td>
                            <td>{racialEthnicGroup ?? "-"}</td>
                            <td>{voteMarginPercent ?? "-"}%</td>
                        </tr>
                       {
                        (selectedDistrict) === String(districtNumber) && (
                            <tr>
                                <td colSpan={5} className = 'border-l-2 border-emerald-400'>
                                    <DistrictRowExpandPanel scores={scores} districtNumber={districtNumber} />
                                </td>
                            </tr>
                        )}
                        </Fragment>
                )}) }
                        
                    </tbody>
                </table>
                <div className='sticky bottom-0 bg-white py-2 flex justify-center'>
                    <PageControls ref={pageRef} currPage = {currPage} prev = {goPrev} next = {goNext} hasPrev = {hasPrev} hasNext = {hasNext} />
                </div>
            </div>
            
        </DetailPanel>
    )

}