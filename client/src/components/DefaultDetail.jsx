import { PARTY_COLORS, APP_COLORS, PARTY_REFS, FEASIBLE_MINORITIES } from "../utils/constants";
import { normalizeParty, toPercent } from "../utils/helpers";
import { BarSection } from './HorizontalBar';


/* Default state information component*/
export default function DefaultDetail({selectedState, races, stateVoterDist, partyControl, pageNum, statePopulation, repSummary, ensembleDetail}){
console.log('roughProp:', ensembleDetail?.roughProp, 'selectedstate:', selectedState, 'minorities:', FEASIBLE_MINORITIES[selectedState]);

    return(
    <div className = 'flex flex-col border-divide gap-3 w-full'>
        {pageNum === 'population' ?
            <>
            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>Total State Population</span>
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

            <div className = 'flex text-gray-500 justify-between pt-3'>
                <span>Total Districts</span>
                <span className = {`font-bold`}>{repSummary.total}</span>
            </div>

            <BarSection title = "State Voter Distribution" arr={stateVoterDist.map(ele => ({
                label: PARTY_REFS[normalizeParty(ele.party)]?.label ?? ele.party,
                sublabel: "",
                color: ele.partyColor,
                percent: ele.percent
            }))} />


            <div className = 'flex flex-col text-gray-500 justify-between pt-3 gap-2'>
                State Representatives Distribution
                <div className="flex flex-col gap-1 px-1">
                    
                    <div className="flex rounded-md overflow-hidden h-3">
                        <div style={{ width: `${toPercent(repSummary.demPct)}%`, backgroundColor: PARTY_COLORS.dem }} className="transition-all duration-500" />
                        <div style={{ width: `${toPercent(repSummary.repPct)}%`, backgroundColor: PARTY_COLORS.rep }} className="transition-all duration-500" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span className="font-semibold" style={{ color: PARTY_COLORS.dem }}>{repSummary.repCounts.dem ?? 0} Democrats </span>
                        <span className="font-semibold" style={{ color: PARTY_COLORS.rep }}>{repSummary.repCounts.rep ?? 0} Republicans</span> 

                    </div>
                </div>
            </div>
            </>
        : 
        <>
            <div className='flex flex-col gap-5 pt-3 text-gray-500 w-full'>

                <div className='flex flex-col gap-2'>
                    <div className = 'text-gray-500'>Ensemble Summary</div>
                    <div className='rounded-md overflow-hidden border border-gray-200'>
                        <div className='grid grid-cols-3 px-3 py-1 bg-gray-50 border-b border-gray-200'>
                            <span />
                            <span className='text-right font-bold text-xs text-gray-400'>VRA</span>
                            <span className='text-right font-bold text-xs  text-gray-400'>Race-Blind</span>
                        </div>
                        <div className='grid grid-cols-3 px-3 py-2 items-center border-b border-gray-200'>
                            <span className='text-gray-500'>Number of Plans</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.vra?.plans?.toLocaleString()}</span>
                            <span className='text-right font-semibold tabular-nums text-gray-600'>{ensembleDetail?.raceBlind?.plans?.toLocaleString()}</span>
                        </div>
                        <div className='grid grid-cols-3 px-3 py-2 items-center'>
                            <span className='text-gray-500 whitespace-nowrap'>Population Threshold</span>
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
                        {ensembleDetail?.roughProp && FEASIBLE_MINORITIES[selectedState]?.map((minority, i, arr) => (
                            <div
                            key={minority.value}
                            className={`grid grid-cols-2 px-3 py-2 items-center ${i < arr.length-1 ? 'border-b border-gray-200' : ''}}`}
                            >
                                <span className='text-sm text-gray-500'>{minority.label}</span>
                                <span className={`text-right text-sm tabular-nums font-bold ${ensembleDetail.roughProp[minority.value] >= 1 ? 'text-emerald-500' : 'text-gray-500'}`}>
                                    {ensembleDetail.roughProp[minority.value]?.toFixed(3) ?? '-'}
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