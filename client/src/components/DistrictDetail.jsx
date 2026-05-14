import { Fragment, useLayoutEffect } from 'react';

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
    const [scores, setScores] = useState(null);
    const expandRowRef = useRef(null);

    const [perPage, setPerPage] = useState(7);
    const [rowsWithExpand, setRowsWithExpand] = useState(7);

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const districtArr = store?.representatives || [];

    const effectivePerPage = selectedDistrict ? rowsWithExpand : perPage;
    const { onPage, currPage, goPrev, goNext, hasPrev, hasNext, goToSpecific } = usePaginate(districtArr, effectivePerPage);

    // fetch data
    useEffect(() => {
        if (!selectedState) return;
        getDistrictScores(selectedState).then(res => setScores(res.data)).catch(console.error);
    }, [selectedState]);

    // navigate to selected district's page location
    useEffect(() => {
        if (!selectedDistrict) return;
        goToSpecific(parseInt(selectedDistrict, 10) - 1);
    }, [selectedDistrict, effectivePerPage, rowsWithExpand]);

    // reset to page 1 on deselect
    useEffect(() => {
        if (selectedDistrict) return;
        goToSpecific(0);
    }, [selectedDistrict]);

    const calculate = () => {
        if (containerRef.current && theadRef.current && rowRef.current && pageRef.current && titleRef.current) {
            
            const available = containerRef.current.clientHeight
                            - theadRef.current.clientHeight
                            - titleRef.current.clientHeight
                            - pageRef.current.clientHeight
                            - 60;

            const row_height = rowRef.current.clientHeight;
            const expand_height = expandRowRef.current?.clientHeight ?? 0;

            setPerPage(Math.max(1, Math.floor(available / row_height)));
            if (expand_height > 0) {
                setRowsWithExpand(Math.max(1, Math.floor((available - expand_height) / row_height)));
            }
        }
    };

    useEffect(() => {
        if (!expanded) return;
        const observer = new ResizeObserver(calculate);
        if (containerRef.current) observer.observe(containerRef.current);
        if (expandRowRef.current) observer.observe(expandRowRef.current);
        return () => observer.disconnect();
    }, [expanded, selectedDistrict]);

    useLayoutEffect(() => {
        if (!expanded) return;
        requestAnimationFrame(calculate);
    }, [expanded, selectedDistrict]);


    return(

        <DetailPanel title="District Detail" expanded={expanded} onClick={onClick} className="pt-4" containerRef={containerRef} titleRef = {titleRef}>
            
            <div className={`flex flex-col relative flex-1 justify-between items-center gap-5 ${expanded ? 'opacity-100 pt-5' : 'max-h-0 opacity-0'}`}>
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
                        return(<Fragment key={districtNumber}>
                        <tr 
                            ref={index === 0 ? rowRef : null} 
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
                            <td className = 'text-right pr-5'>{voteMarginPercent ?? "-"}%</td>
                        </tr>
                       {
                        (selectedDistrict) === String(districtNumber) && (
                            <tr ref={expandRowRef}>
                                <td colSpan={5} className = 'border-l-2 border-emerald-400'>
                                    <DistrictRowExpandPanel state = {selectedState} scores={scores} districtNumber={districtNumber} />
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