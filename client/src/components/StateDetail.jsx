import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, UserIcon } from '@heroicons/react/24/solid'
import {useState, useEffect, useContext} from 'react'
import GlobalStoreContext from '../store';

import CongressRepDetail from './CongressRepDetail';
import DetailPanel from './DetailPanel';

import { PARTY_COLORS, APP_COLORS } from '../utils/constants';
import { normalizeParty, capitalize } from '../utils/helpers';

import { getStateDetail } from '../api/api';


export default function StateDetail({expanded, onClick}){

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const repArr = store?.representatives || [];

    const [view, setView] = useState('page1');
    const [stateDetail, setStateDetail] = useState(null);

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

    const statePopulation = stateDetail?.racialPopulation.total ?? 0;
    const partyControl = stateDetail?.voterDistribution.partyControl ?? "";

    useEffect(() => {
        if(!selectedState) return;

        getStateDetail(selectedState)
            .then((res) => {
                console.log("State detail from server:", res.data);
                setStateDetail(res.data);
            })
            .catch((err) => console.error("Error loading state detail json:", err));

    }, [selectedState]);


    return(
        <DetailPanel title="State Detail" expanded={expanded} onClick={onClick}>
            <div className={`flex-1 relative gap-10 px-5 overflow-y-auto overflow-x-hidden ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className = {`h-full ${view === 'reps' ? 'slideInR': 'slideInL'}`}>
                { view === 'reps' ? 
                    <div className = 'flex flex-col h-full gap-5 w-full'>
                        <RepDetailButton chevronDir = 'L' toWhere = {()=>setView('page2')}/>
                        <CongressRepDetail repArr = {repArr} />
                    </div>
                :
                    <div className = 'flex flex-col gap-5 h-full w-full'>
                        <DefaultDetail races = {raceArr} stateVoterDist = {voterDist} partyControl = {partyControl} pageNum = {view} statePopulation = {statePopulation}/>
                        {view==='page2' && <RepDetailButton chevronDir = 'R' toWhere = {()=>setView('reps')}/> }
                        <PageNum pageNum = {view} setPageNum = {setView}/>
                    </div>
                }
                </div>

            </div>                
        </DetailPanel>
   )

}

/* Bar percentage color code */
function BarFill({percent, color}){
    return(
        <div className = "w-full bg-gray-100 rounded-md h-3">
            <div className = {`rounded-md h-3`} 
                style = {{width: `${percent}%`, backgroundColor: color}}>
            </div>
        </div>

    )
}

/* Actual bar graph component code */
function BarSection({title, arr}){

    return(
    <div className = 'flex flex-col gap-2 text-gray-500 pt-5'>
       <span>{title}</span>
                
        <div className = 'flex flex-col gap-3 w-full text-sm'>
            {arr.map(({label, percent, color, sublabel}, i) => (
            <div key = {`${label}-${i}`} className = 'w-full'>
                <div className = 'flex justify-between'>
                    <span className = 'text-gray-400'>{label}</span>
                    <span className = 'flex gap-2'>
                        <span className = 'text-gray-400'>{sublabel.toLocaleString()}</span>
                        <span className = 'font-bold'>{percent.toFixed(2)}%</span>
                    </span>
                </div>
                
                <BarFill percent = {percent} color = {color}></BarFill>
            </div>
            ))}
        </div>
                
    </div>

    )
}    

/* Default state information component*/
function DefaultDetail({races, stateVoterDist, partyControl, pageNum, statePopulation}){

    return(
    <div className = 'flex flex-col border-divide gap-3 w-full'>
        {pageNum === 'page1' ?
            <>
            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>State Population</span>
                <span className = "text-emerald-500 font-bold">{statePopulation.toLocaleString()}</span>
            </div>
            <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: APP_COLORS.accentGreen, percent: ele.percent}))} />
            </>
        :
        <>
        <div className = 'flex text-gray-500 justify-between pt-3'>
            <span>Party Control</span>
            <span className = {`font-bold`}
                style = {{color: PARTY_COLORS[normalizeParty(partyControl)]}}>{partyControl}</span>
        </div>
        <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
         </>
        }
    </div>
    )
}



/* "Congressional Represenatives > " button logic */

function RepDetailButton({chevronDir, toWhere}){
    const isLeft = (chevronDir === 'L');
    return(
        <div className = 'group flex text-gray-500 justify-between cursor-pointer hover:bg-gray-100 px-5 -mx-5 py-3' onClick = {toWhere}
            style = {{flexDirection: isLeft? "row-reverse" : "row"}}>
            <span className = {`transition-transform duration-300 ${isLeft ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>Congressional Representatives</span>
            {isLeft  ? 
            (<ChevronLeftIcon className = 'w-5 transition-transform duration-300 group-hover:-translate-x-2 '/>)
            :
            (<ChevronRightIcon className = 'w-5 transition-transform duration-300  group-hover:translate-x-2 '/>)
            } 
        </div>
    )
}

function PageNum({pageNum, setPageNum}){
    const page = pageNum === "page1"? 1:2;

    return(
        <div className = 'flex items-center justify-center gap-2 w-full text-center cursor-pointer absolute bottom-5 left-0 right-0'>
            <button onClick = {()=>setPageNum('page1')} className = {`rounded-md border-2 border-gray-200 py-1 w-7 hover:bg-gray-200 ${page === 1 ? 'bg-gray-200':''}`}>1</button>
            <button onClick = {()=>setPageNum('page2')} className = {`rounded-md border-2 border-gray-200 py-1 w-7 hover:bg-gray-200 ${page === 2 ? 'bg-gray-200':''}`}>2</button>
        </div>
    )
}