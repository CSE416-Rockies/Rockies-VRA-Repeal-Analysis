import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, UserIcon } from '@heroicons/react/24/solid'
import {useState, useEffect, useContext} from 'react'
import { usePaginate } from '../hooks/paginate';
import PageControls from './PageControls';
import GlobalStoreContext from '../store';
import { getStateDetail } from '../api/api';

export default function StateDetail({expanded, onClick}){

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const repArr = store?.representatives || [];

    const [view, setView] = useState('page1');
    const [voterDist, setVoterDist] = useState([]);
    const [raceArr, setRaceArr] = useState([]);
    const [statePopulation, setStatePopulation] = useState(0);
    const [partyControl, setPartyControl] = useState("");
    

    useEffect(() => {
        if(!selectedState) return;


        getStateDetail(selectedState)
            .then((res) => {
                console.log("State detail from server:", res.data);
                const data = res.data;
                
                setVoterDist([
                    { party: "Democrat", partyColor: "bg-blue-500", percent: data.voterDistribution.democratPercentage },
                    { party: "Republican", partyColor: "bg-red-500", percent: data.voterDistribution.republicanPercentage },
                    { party: "Other", partyColor: "bg-gray-500", percent: data.voterDistribution.otherPercentage },
                ]
                );
                setRaceArr([
                    { race: "White", popNumber: data.racialPopulation.whitePopulation, percent: data.racialPopulation.whitePercentage },
                    { race: "Black", popNumber: data.racialPopulation.blackPopulation, percent: data.racialPopulation.blackPercentage },
                    { race: "Latino", popNumber: data.racialPopulation.latinoPopulation, percent: data.racialPopulation.latinoPercentage },
                    { race: "Other", popNumber: data.racialPopulation.otherPopulation, percent: data.racialPopulation.otherPercentage },
                ]);
                setStatePopulation(data.racialPopulation.total);
                setPartyControl(data.voterDistribution.partyControl);
            })
            .catch((err) => console.error("Error loading state detail json:", err));

    }, [selectedState]);


    return(
        <div className = 'bg-white rounded-2xl shadow-md flex flex-col w-full pt-5 text-sm overflow-hidden min-h-0 transition-all duration-700 ease-in-out border-divide' 
             style={{ flex: expanded ? 1 : '0 0 auto'}}
        >
            
            <div className = 'flex bg-white w-full justify-between text-xl px-5 pb-5 text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>State Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>


                <div className={`flex-1 relative gap-10 px-5 overflow-y-auto overflow-x-hidden ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className = {`h-full ${view == 'reps' ? 'slideInR': 'slideInL'}`}>

                    { view == 'reps' ? 
                        <div className = 'flex flex-col h-full gap-5 w-full'>
                            <RepDetailButton chevronDir = 'L' toWhere = {()=>setView('page2')}/>
                            <CongressRepDetail repArr = {repArr} />
                        </div>
                    :
                        <div className = 'flex flex-col gap-5 h-full w-full'>
                            <DefaultDetail races = {raceArr} stateVoterDist = {voterDist} partyControl = {partyControl} pageNum = {view} statePopulation = {statePopulation}/>
                            {view=='page2' && <RepDetailButton chevronDir = 'R' toWhere = {()=>setView('reps')}/> }
                            <PageNum pageNum = {view} setPageNum = {setView}/>
                        </div>
                    }
                    </div>

                    
                </div>
        </div>
   )

}

/* Bar percentage color code */
function BarFill({percent, color}){

    return(
        <div className = "w-full bg-gray-100 rounded-md h-3">
            <div className = {`${color} rounded-md h-3`} 
                style = {{width: `${percent}%`}}>
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
                    <span>{label}</span>
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
        {pageNum == 'page1' ?
            <>
            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>State Population</span>
                <span className = "text-emerald-500 font-bold">{statePopulation.toLocaleString()}</span>
            </div>
            <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: 'bg-emerald-500', percent: ele.percent}))} />
            </>
        :
        <>
        <div className = 'flex text-gray-500 justify-between pt-3'>
            <span>Party Control</span>
            <span className = {`font-bold ${partyControl == "Republican"? 'text-red-500' : 'text-blue-500'}`}>{partyControl}</span>
        </div>
        <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
         </>
        }
    </div>
    )
}

function CongressRepDetail({repArr, onClick}){
    const perPage = 4;
    const {onPage, currPage, goPrev, goNext, hasPrev, hasNext, _ } = usePaginate(repArr, perPage);

    return(
        <div className = 'flex flex-col gap-5 justify-between items-center px-2'>
            <div className = 'grid grid-cols-2 gap-5 w-full' onClick = {onClick}>

                {onPage.map(({districtNumber, name, party, imageId, status})=>(
                    <div className = 'flex gap-2' key = {`${districtNumber}-${onPage}`}>
                        { status == "Vacant" ? 
                        <div className = 'flex justify-center items-center rounded-md w-16 h-20 bg-gray-200'>
                            <UserIcon className = 'w-10 text-gray-500'/>
                        </div>
                        : <img src = {`/representatives/${imageId}.jpg`} className = 'w-16 h-20 object-cover rounded-md'/>}
                        <div className = 'flex flex-col gap-0.5 justify-center'>
                            <div className = 'text-sm font-semibold'>{name ?? "Vacant"}</div>
                            <div className = 'text-xs text-gray-500'>District {districtNumber}</div>
                            <div className = {`text-xs capitalize rounded-xl ${party === "Republican"? 'text-red-500' : 'text-blue-500'}`}>{party ?? ""}</div>
                        </div>
                        
                    </div>
                ))}

            </div>
                <PageControls currPage = {currPage} prev = {goPrev} next = {goNext} hasPrev = {hasPrev} hasNext = {hasNext}/>
        </div>
    )
}


/* "Congressional Represenatives > " button logic */

function RepDetailButton({chevronDir, toWhere}){
    const isLeft = (chevronDir == 'L');
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
    const page = pageNum == "page1"? 1:2;

    return(
        <div className = 'flex items-center justify-center gap-2 w-full text-center cursor-pointer absolute bottom-5 left-0 right-0'>
            <button onClick = {()=>setPageNum('page1')} className = {`rounded-md border-2 border-gray-200 py-1 w-7 hover:bg-gray-200 ${page == 1 ? 'bg-gray-200':''}`}>1</button>
            <button onClick = {()=>setPageNum('page2')} className = {`rounded-md border-2 border-gray-200 py-1 w-7 hover:bg-gray-200 ${page == 2 ? 'bg-gray-200':''}`}>2</button>
        </div>
    )
}