import Tooltip from "./Tooltip"
import { toPercent } from "../utils/helpers";

export default function ThresholdTable({data, racialGroup, aggregate = false}){
     if (!data) return null;

    const groupData = aggregate ? data.aggregate : data.groups?.[racialGroup];

    return(
        <table className = 'w-full text-sm border-2 rounded-md'>
            <thead className = 'text-left text-gray-400'>
                <tr>
                    <th className = 'pl-4 py-2 w-2/5'>VRA Threshold</th>
                    <th>Race-Blind</th>
                    <th>VRA-Constrained</th>
                </tr>
            </thead>
            <tbody>
                {[
                    { label: 'Satisfies enacted effectiveness', raceBlind: toPercent(groupData.enactedThreshold.raceBlind), vra: toPercent(groupData.enactedThreshold.vra),  subText: "≥ number of effective districts in a plan"},
                    { label: 'Satisfies rough proportionality', raceBlind: toPercent(groupData.proportionalThreshold.raceBlind), vra: toPercent(groupData.proportionalThreshold.vra), subText: "≥ number of effective districts proportional to demographics",},
                    { label: 'Satisfies both conditions above', raceBlind: toPercent(groupData.bothThreshold.raceBlind),  vra: toPercent(groupData.bothThreshold.vra),  subText: "", },
                ].map(({label, raceBlind, vra, subText}, index)=> (
                    <tr key = {index} className = {`${index % 2 === 0 ? 'bg-gray-100' : ''}`}> 
                        <td className = 'relative pl-4 py-2 group cursor-pointer'> 
                            {label}
                            {subText && <Tooltip desc = {subText} plain = {true}/>}
                        </td>
                        <td> {raceBlind}% </td>
                        <td> {vra}% </td>
                    </tr>

                    
                )
                )
                
                }
            </tbody>
            
        </table>
    )
}