import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, UserIcon } from '@heroicons/react/24/solid'
import {useState, useEffect, useContext} from 'react'
import GlobalStoreContext from '../store';

import CongressRepDetail from './CongressRepDetail';
import DetailPanel from './DetailPanel';

import { PARTY_COLORS, APP_COLORS } from '../utils/constants';
import { normalizeParty, capitalize } from '../utils/helpers';

import { getEnsembleSummary, getStateDetail } from '../api/api';
import ErrorMsg from './ErrorMsg';
import DefaultDetail from './DefaultDetail';

export default function StateDetail({expanded, onClick}){

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    const [view, setView] = useState('population');
    const [stateDetail, setStateDetail] = useState(null);
    const [ensembleDetail, setEnsembleDetail] = useState(null);
    const [error, setError] = useState(null);

    /* ------------------------------------------------------------------------- variables */

    const voterDist = stateDetail ? 
        Object.entries(stateDetail.voterDistribution.distributions).map(([party, percent]) => ({
            party: capitalize(party),
            partyColor: PARTY_COLORS[normalizeParty(party)],
            percent: percent,
        })).sort((a, b) => b.percent - a.percent): [];

    const raceArr = stateDetail ? 
        Object.entries(stateDetail.racialPopulation.populations).map(([race, pop]) => ({
            race: capitalize(race),
            popNumber: pop,
            percent: (pop / stateDetail.racialPopulation.totalPopulation * 100)
    })).sort((a, b) => b.percent - a.percent) : [];

    const statePopulation = stateDetail?.racialPopulation.totalPopulation ?? 0;
    console.log(stateDetail);
    const partyControl = stateDetail?.voterDistribution.partyControl ?? "";

    useEffect(() => {
        if(!selectedState) return;

        Promise.allSettled([
            getStateDetail(selectedState),
            getEnsembleSummary(selectedState),
        ]).then(([stateDetailRes, ensembleSummaryRes]) => {
            if (stateDetailRes.status == "fulfilled") setStateDetail(stateDetailRes.value.data);
            else setError("Failed to load state detail data.");
    
            if (ensembleSummaryRes.status == "fulfilled") setEnsembleDetail(ensembleSummaryRes.value.data);
            else setError("Failed to load ensemble summary data.");
        }).catch(err => {
            console.error("Error loading data:", err);
        });
    }, [selectedState]);


    return(
        <DetailPanel title="State Detail" expanded={expanded} onClick={onClick}>
            <div className={`flex-1 relative gap-10 px-5 overflow-y-auto overflow-x-hidden ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                {error ? 
                    <div className = 'flex justify-center py-5'>
                        <ErrorMsg message = {error}/>
                    </div>
                :   
                    <div className = {`h-full ${view === 'reps' ? 'slideInR': 'slideInL'}`}>
                { view === 'reps' ? 
                    <div className = 'flex flex-col h-full gap-5 w-full'>
                        <RepDetailButton chevronDir = 'L' toWhere = {()=>setView('politics')}/>
                        <CongressRepDetail />
                    </div>
                :
                    <div className = 'flex flex-col gap-5 h-full w-full'>
                        <DefaultDetail races = {raceArr} stateVoterDist = {voterDist} partyControl = {partyControl} pageNum = {view} statePopulation = {statePopulation} ensembleDetail = {ensembleDetail}/>
                        {view==='politics' && <RepDetailButton chevronDir = 'R' toWhere = {()=>setView('reps')}/> }
                        <PageNum pageNum = {view} setPageNum = {setView}/>
                    </div>
                }
                </div>
                }
                

            </div>                
        </DetailPanel>

   )

}



/* "Congressional Represenatives > " button logic */

function RepDetailButton({chevronDir, toWhere}){
     const { store } = useContext(GlobalStoreContext);

    const repArr = store?.representatives || [];

    const isLeft = (chevronDir === 'L');

    const repCounts = repArr.reduce((acc, rep)=>{
        const party = normalizeParty(rep.party);
        acc[party] = (acc[party] || 0) + 1;
        return acc;
    }, {});

    return(
        <div className = 'group flex text-gray-500 justify-between cursor-pointer hover:bg-gray-100 px-5 -mx-5 py-3' onClick = {toWhere}
            style = {{flexDirection: isLeft? "row-reverse" : "row"}}>
            <div className = {`flex items-center gap-2 transition-transform duration-300 ${isLeft ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                Congressional Representatives
                { !isLeft &&
                <span className='text-xs flex gap-1'>
                    (
                    <span className = 'font-bold' style={{ color: PARTY_COLORS.dem }}> {repCounts.dem ?? 0}D </span> / 
                    <span className = 'font-bold' style={{ color: PARTY_COLORS.rep }}> {repCounts.rep ?? 0}R</span>
                    )
                </span> 
            }
                
                
            </div>
            
            {isLeft  ? 
            (<ChevronLeftIcon className = 'w-5 transition-transform duration-300 group-hover:-translate-x-2 '/>)
            :
            (<ChevronRightIcon className = 'w-5 transition-transform duration-300  group-hover:translate-x-2 '/>)
            } 
        </div>
    )
}

function PageNum({ pageNum, setPageNum }) {
    const tabs = [
        { value: 'population', label: 'Demographics' },
        { value: 'politics', label: 'Politics' },
        { value: 'ensemble', label: 'Ensembles' },
    ];

    return (
        <div className='flex border-t border-gray-200 absolute bottom-0 left-0 right-0'>
            {tabs.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => setPageNum(value)}
                    className={`flex-1 py-3 text-sm transition-colors duration-150
                        ${pageNum === value
                            ? 'text-emerald-500 font-semibold border-t-2 border-emerald-500 -mt-px'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}