import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import {UserIcon} from '@heroicons/react/24/solid'
import {useState, useRef} from 'react'


export default function StateDetail({expanded, onClick}){
    
    const [repDetail, setRepDetail] = useState(false);
    const repTopRef = useRef(null);

    function toReps(){
        setRepDetail(true);
        repTopRef.current.scrollTo({ top: 0 });
    }

    function toDef(){
        setRepDetail(false);
        repTopRef.current.scrollTo({ top: 0 });
    }

    const races = [
        {race: "White", percent: 39.78, popNumber: 700000},
        {race: "Black", percent: 20.14, popNumber: 300000},
        {race: "Latino", percent: 19.98, popNumber: 250000},
        {race: "Other", percent: 2.03, popNumber: 1000},
    ];
    const stateVoterDist = [
        {party: "Democrat", partyColor: 'bg-blue-500', percent: 48.85},
        {party: "Republican", partyColor: 'bg-red-500', percent: 52.00},
        {party: "Other", partyColor: 'bg-gray-500', percent: .15},
    ];

     const reps = [
        {repName: "Bob Dylan", party: 'republican'},
        {repName: "Bob Dylan", party: 'republican'},
        {repName: "Bob Dylan", party: 'democratic'},
        {repName: "Bob Dylan", party: 'democratic'},
        {repName: "Bob Dylan", party: 'republican'},
        {repName: "Bob Dylan", party: 'republican'},
        {repName: "Bob Dylan", party: 'democratic'},
        {repName: "Bob Dylan", party: 'republican'},
        {repName: "Bob Dylan", party: 'democratic'},
        {repName: "Bob Dylan", party: 'democratic'},
    ]

    const partyControl = "Democrat";


    return(
        <div className = 'bg-white rounded-2xl shadow-md flex flex-col w-full py-5 text-sm overflow-hidden min-h-0 transition-all duration-700 ease-in-out border-divide' 
             style={{ flex: expanded ? 1 : '0 0 auto'}}
        >
            
            <div className = 'flex bg-white w-full justify-between text-xl px-5 text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>State Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>

            <div ref = {repTopRef} className={`relative gap-10 px-5 overflow-y-scroll overflow-x-hidden ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className = {` ${repDetail ? 'slideInR': 'slideInL'}`}>

                {!repDetail ? 
                    (<div className = 'flex flex-col gap-5'>
                        <DefaultDetail races = {races} stateVoterDist = {stateVoterDist} partyControl = {partyControl}/>
                        <div className = 'group flex text-gray-500 justify-between cursor-pointer hover:bg-gray-100 -mx-5 p-5' onClick = {toReps}>
                            <span className = 'group-hover:translate-x-2'>Congressional Representatives</span>
                            <ChevronRightIcon className = 'w-5 group-hover:translate-x-2 '/>
                        </div>
                    </div>)
                
                    :

                    (<div className = 'flex flex-col'>
                        <div className = 'group flex text-gray-500 justify-between cursor-pointer hover:bg-gray-100 -mx-5 p-5' onClick = {toDef}>
                            <ChevronLeftIcon className = 'w-5 group-hover:-translate-x-2 '/>
                            <span className = 'group-hover:-translate-x-2'>Congressional Representatives</span>
                        </div>
                        <CongressRepDetail repArr = {reps} />
                        
                    </div>)
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
    <div className = 'flex flex-col gap-2 text-gray-500'>
       <span>{title}</span>
                
        <div className = 'flex flex-col gap-5 w-full text-sm'>
            {arr.map(({label, percent, color, sublabel}) => (
            <div key = {label} className = 'w-full'>
                <div className = 'flex justify-between'>
                    <span>{label}</span>
                    <span className = 'flex gap-2'>
                        <span className = 'text-gray-400'>{sublabel}</span>
                        <span className = 'font-bold'>{percent.toFixed(2)}</span>
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
function DefaultDetail({races, stateVoterDist, partyControl}){

    return(
    <>
        <div className = 'flex text-gray-500 justify-between pt-5'>
            <span>State Population</span>
            <span className = "text-emerald-500 font-bold">3,200,000</span>
        </div>
        <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: 'bg-emerald-500', percent: ele.percent}))} />
        <div className = 'flex text-gray-500 justify-between'>
            <span>Party Control</span>
            <span className = {`font-bold ${partyControl == "Republican"? 'text-red-500' : 'text-blue-500'}`}>{partyControl}</span>
        </div>
        <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
    </>
    )
}

function CongressRepDetail({repArr, onClick}){

    return(
    <div className = 'grid grid-cols-2 gap-5 p-5' onClick = {onClick}>

        {repArr.map(({repName, party})=>(
            <div className = 'flex gap-2'>
                <UserIcon className = 'w-8'/>
                <div className = 'flex flex-col gap-1'>
                    <div className = 'text-sm'>{repName}</div>
                    <div className = {`text-xs capitalize ${party == "republican"? 'text-red-500' : 'text-blue-500'}`}>{party} Party</div>
                </div>
            </div>
        ))}
    </div>
    )
}