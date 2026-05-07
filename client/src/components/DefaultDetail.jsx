import { PARTY_COLORS, APP_COLORS, ME_COLORS } from "../utils/constants";
import { capitalize, normalizeParty } from "../utils/helpers";
import { BarSection } from './HorizontalBar';


/* Default state information component*/
export default function DefaultDetail({races, stateVoterDist, partyControl, pageNum, statePopulation, ensembleDetail}){

    return(
    <div className = 'flex flex-col border-divide gap-3 w-full'>
        {pageNum === 'population' ?
            <>
            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>State Population</span>
                <span className = "text-emerald-500 font-bold">{statePopulation.toLocaleString()}</span>
            </div>
            <BarSection title = "Racial Population" arr = {races.map(ele=> ({label: ele.race, sublabel: ele.popNumber, color: APP_COLORS.accentGreen, percent: ele.percent}))} />
            </>
        : pageNum === "politics" ? 
            <>
            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>Party Control</span>
                <span className = {`font-bold`}
                    style = {{color: PARTY_COLORS[normalizeParty(partyControl)]}}>{partyControl}</span>
            </div>
            <BarSection title = "State Voter Distribution" arr = {stateVoterDist.map(ele=> ({label: ele.party, sublabel: "", color: ele.partyColor, percent: ele.percent}))} />
            </>
        : 
        <>
            <div className='flex flex-col gap-5 pt-3 text-gray-400 w-full'>

                <div className='flex flex-col gap-2'>
                    <div className = 'text-gray-500'>Ensemble Summary</div>
                    <div className='rounded-md overflow-hidden border border-gray-200'>
                        <div className='grid grid-cols-3 px-3 py-1 bg-gray-50 border-b border-gray-200'>
                            <span />
                            <span className='text-right font-bold text-xs text-gray-400'>VRA</span>
                            <span className='text-right font-bold text-xs  text-gray-400'>Race-Blind</span>
                        </div>
                        <div className='grid grid-cols-3 px-3 py-2 items-center border-b border-gray-100'>
                            <span className='text-gray-400'>Num Plans</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.vra?.plans?.toLocaleString()}</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.raceBlind?.plans?.toLocaleString()}</span>
                        </div>
                        <div className='grid grid-cols-3 px-3 py-2 items-center'>
                            <span className='text-gray-400'>Pop. Threshold</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.vra?.threshold}</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.raceBlind?.threshold}</span>
                        </div>
                    </div>
                </div>
 
                <div className='flex flex-col gap-2'>
                    <div className = 'text-gray-500'>Rough Proportionality</div>
                    <div className='rounded-md overflow-hidden border border-gray-200'>
                        <div className='grid grid-cols-2 px-3 py-1 bg-gray-50 border-b border-gray-200'>
                            <span className='text-xs font-semibold text-gray-400'>Group</span>
                            <span className='text-right text-xs font-semibold text-gray-400'>Measure</span>
                        </div>
                        {ensembleDetail?.roughProp && Object.entries(ensembleDetail.roughProp).map(([race, ratio], i, arr) => (
                            <div
                                key={race}
                                className='grid grid-cols-2 px-3 py-2 items-center'
                                style={{ borderBottom: i < arr.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                            >
                                <span className='text-sm text-gray-400'>{capitalize(race)}</span>
                                <span className={`text-right text-sm tabular-nums ${ratio >= 1 && ratio > 0 ? 'font-semibold text-emerald-500' : 'text-gray-400'}`}>
                                    {ratio.toFixed(3)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
        }
    </div>
    )
}