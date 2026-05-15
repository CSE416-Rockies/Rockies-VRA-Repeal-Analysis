import { toPercent } from "../utils/helpers";

export default function ThresholdTable({data, racialGroup}){
     if (!data) return null;

    const groupData = data.groups?.[racialGroup];

    return(
        <table className = 'w-full text-sm border-2 rounded-md'>
            <thead className = 'text-left text-gray-400'>
                <tr>
                    <th className = 'pl-4 py-2 w-2/5'>VRA Threshold</th>
                    <th className = 'text-right pr-4'>Race-Blind</th>
                    <th className = 'text-right pr-4'>VRA-Constrained</th>
                </tr>
            </thead>
            <tbody>
                {[
                    { label: 'Satisfies enacted effectiveness', raceBlind: toPercent(groupData.enactedThreshold.raceBlind), vra: toPercent(groupData.enactedThreshold.vra),  subText: "≥ number of effective districts in a plan"},
                    { label: 'Satisfies rough proportionality', raceBlind: toPercent(groupData.proportionalThreshold.raceBlind), vra: toPercent(groupData.proportionalThreshold.vra), subText: "≥ number of effective districts proportional to demographics",},
                    { label: 'Satisfies both conditions above', raceBlind: toPercent(groupData.bothThreshold.raceBlind),  vra: toPercent(groupData.bothThreshold.vra),  subText: "", },
                ].map(({label, raceBlind, vra, subText}, index)=> (
                    <tr key = {index} className = {`${index % 2 === 0 ? 'bg-gray-100' : ''}`}> 
                        <td className='pl-4 py-2'>
                            <span className= {`relative group ${subText && 'cursor-help'} inline-block`}>
                                {label}
                                {subText && (
                                    <div className='absolute left-0 top-full mt-1 -ml-2 w-44 bg-white border border-gray-200 shadow-md rounded-lg px-3 py-2 text-xs text-gray-600 z-50 hidden group-hover:block'>
                                        {subText}
                                    </div>
                                )}
                            </span>
                        </td>
                        <td className = 'text-right pr-4'> {raceBlind}% </td>
                        <td className = 'text-right pr-4'> {vra}% </td>
                    </tr>    
                )
                )
                
                }
            </tbody>
            
        </table>
    )
}