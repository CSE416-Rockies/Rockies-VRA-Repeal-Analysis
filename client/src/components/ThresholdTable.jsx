import Tooltip from "./Tooltip"

export default function ThresholdTable(){

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
                    { label: 'Satisfies enacted effectiveness', raceBlind: '%', vra: '%', subText: "≥ number of effective districts in a plan"},
                    { label: 'Satisfies rough proportionality', raceBlind: '%', vra: '%' , subText: "≥ number of effective districts proportional to demographics",},
                    { label: 'Satisfies both conditions above', raceBlind: '%', vra: '%' , subText: "", },
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