import { ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'


export default function StateDetail({expanded, onClick}){
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

    const partyControl = "Democrat";


    return(
        <div className = "flex flex-col bg-white shadow-md rounded-2xl w-full p-5">
            <div className = 'flex bg-white w-full justify-between text-xl text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>State Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>

            <div className={`flex flex-col gap-5 overflow-scroll transition-all duration-700 ease-in-out ${expanded ? 'max-h-80 pt-5' : 'max-h-0'}`}>
            
                <div className = 'flex text-gray-500 justify-between'>
                    <span>State Population</span>
                    <span className = "text-emerald-500 font-bold">3,200,000</span>
                </div>

                <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: 'bg-emerald-500', percent: ele.percent}))} />

                <div className = 'flex text-gray-500 justify-between'>
                    <span>Party Control</span>
                    <span className = {`${partyControl == "Republican"? 'text-red-500' : 'text-blue-500'}`}>{partyControl}</span>
                </div>

                <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
                
                <div className = 'flex text-gray-500 justify-between'>
                    <span>Congressional Representatives</span>
                    <ChevronRightIcon className = 'w-5'/>
                </div>
            </div>
        </div>

   )

}

function BarFill({percent, color}){

    return(
        <div className = "w-full bg-gray-100 rounded-md h-3">
            <div className = {`${color} rounded-md h-3`} 
                style = {{width: `${percent}%`}}>
            </div>
        </div>

    )
}

function BarSection({title, arr}){

    return(
        <div className = 'flex flex-col text-gray-500'>
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