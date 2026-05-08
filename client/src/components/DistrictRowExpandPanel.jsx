import { FEASIBLE_MINORITIES } from '../utils/constants';
export default function DistrictRowExpandPanel({ state, scores, districtNumber}) {
    if (!scores) return <div className='px-5 py-3 text-gray-400 text-sm'>Issue with fetching scores</div>;
    const feasibleRaces = FEASIBLE_MINORITIES[state];

    return (
        <div className='px-8 py-2 border-t border-gray-200'>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='text-gray-400'>
                        <th className='text-left w-32'></th>
                        {feasibleRaces.map(r => <th key={r.value} className = 'text-left font-normal'>{r.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    
                    {['calculated', 'calibrated'].map(scoreType => (
                        <tr key={scoreType}>
                            <td className='text-gray-400 capitalize'>{scoreType}</td>
                            {feasibleRaces.map(race => (
                                <ScoreCell 
                                    key={race.value} 
                                    value={scores[scoreType]?.[districtNumber]?.[race.value]}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ScoreCell({ value }) {
    if (value === null || value === undefined) return <td className='text-gray-300'>-</td>;
    const color = value === 1 ? 'text-emerald-500 font-semibold' : 'text-gray-800';
    return (
        <td className={` ${color}`}>
            {value === 1 ? '1.00' : value === 0 ? '0.00' : value.toFixed(2)}
        </td>
    );
}