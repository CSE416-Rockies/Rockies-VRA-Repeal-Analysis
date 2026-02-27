import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
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
        {dNum: 1, repName: "Bob Dylan", party: 'republican', imgID: 'ga-01'},
        {dNum: 2, repName: "Bob Dylan", party: 'republican', imgID: 'ga-02'},
        {dNum: 3, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-03'},
        {dNum: 4, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-04'},
        {dNum: 5, repName: "Bob Dylan", party: 'republican', imgID: 'ga-05'},
        {dNum: 6, repName: "Bob Dylan", party: 'republican', imgID: 'ga-06'},
        {dNum: 7, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-07'},
        {dNum: 8, repName: "Bob Dylan", party: 'republican', imgID: 'ga-08'},
        {dNum: 9, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-09'},
        {dNum: 10, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-10'},
        {dNum: 11, repName: "Barry Loudermilk", party: 'republican', imgID: 'ga-11'},
        {dNum: 12, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-12'},
        {dNum: 13, repName: "Bob Dylan", party: 'democratic', imgID: 'ga-13'}
    ]

    const partyControl = "Democrat";


    return(
        <div className = 'bg-white rounded-2xl shadow-md flex flex-col w-full pt-5 text-sm overflow-hidden min-h-0 transition-all duration-700 ease-in-out border-divide' 
             style={{ flex: expanded ? 1 : '0 0 auto'}}
        >
            
            <div className = 'flex bg-white w-full justify-between text-xl px-5 pb-5 text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>State Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>


                <div ref = {repTopRef} className={`relative gap-10 px-5 overflow-y-auto overflow-x-hidden ${expanded ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className = {` ${repDetail ? 'slideInR': 'slideInL'}`}>

                    {!repDetail ? 
                        (<div className = 'flex flex-col gap-5'>
                            <DefaultDetail races = {races} stateVoterDist = {stateVoterDist} partyControl = {partyControl}/>
                            <RepDetailButton chevronDir = 'R' toWhere = {toReps}/>
                        </div>)

                        :

                        (<div className = 'flex flex-col'>
                            <RepDetailButton chevronDir = 'L' toWhere = {toDef}/>
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
    <div className = 'flex flex-col gap-2 text-gray-500 pt-5'>
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
    <div className = 'flex flex-col border-divide gap-5'>
        <div className = 'flex text-gray-500 justify-between pt-5'>
            <span>State Population</span>
            <span className = "text-emerald-500 font-bold">3,200,000</span>
        </div>
        <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: 'bg-emerald-500', percent: ele.percent}))} />
        <div className = 'flex text-gray-500 justify-between pt-5'>
            <span>Party Control</span>
            <span className = {`font-bold ${partyControl == "Republican"? 'text-red-500' : 'text-blue-500'}`}>{partyControl}</span>
        </div>
        <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
    </div>
    )
}

function CongressRepDetail({repArr, onClick}){

    return(
    <div className = 'grid grid-cols-2 gap-5 p-5' onClick = {onClick}>

        {repArr.map(({dNum, repName, party, imgID})=>(
            <div className = 'flex gap-2' key = {repName}>
                <img src = {`/representatives/${imgID}.jpg`} className = 'w-16 h-20 object-cover rounded-md'/>
                <div className = 'flex flex-col gap-0.5 justify-center'>
                    <div className = 'text-sm font-semibold'>{repName}</div>
                    <div className = 'text-xs text-gray-500'>District {dNum}</div>
                    <div className = {`text-xs capitalize rounded-xl ${party == "republican"? 'text-red-500' : 'text-blue-500'}`}>{party}</div>
                </div>
            </div>
        ))}
    </div>
    )
}


/* "Congressional Represenatives > " button logic */

function RepDetailButton({chevronDir, toWhere}){
    const isLeft = (chevronDir == 'L');
    return(
        <div className = 'group flex text-gray-500 justify-between cursor-pointer hover:bg-gray-100 -mx-5 p-5' onClick = {toWhere}
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