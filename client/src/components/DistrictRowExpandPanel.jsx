import { FEASIBLE_MINORITIES } from '../utils/constants';
import { useState } from 'react';

export default function DistrictRowExpandPanel({ state, scores, districtNumber}) {
    if (!scores) return <div className='px-5 py-3 text-gray-400 text-sm'>Issue with fetching scores</div>;
    const feasibleRaces = FEASIBLE_MINORITIES[state];

    const TOOLTIP_TEXT = "Effectiveness scores: probability of electing minority-preferred candidates";

    return (
        <div className='px-8 py-2 border-t border-gray-200'>
            <table className='w-full text-sm text-right'>
                <thead>
                    <tr className='text-gray-400'>
                        <th className='text-left w-32'><Tooltip text={TOOLTIP_TEXT} /></th>
                        {feasibleRaces.map(r => <th key={r.value} className = 'text-right font-normal'>{r.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    
                    {['calculated', 'calibrated'].map(scoreType => (
                        <tr key={scoreType}>
                            <td className='text-gray-400 capitalize text-left'>{scoreType} score</td>
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

function Tooltip({ text }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className='relative flex-shrink-0' onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <div className='w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center cursor-default select-none'>
                ?
            </div>
            {visible && (
                <div className='absolute right-full mr-10 top-1/2 -translate-y-1/2 w-44 bg-white border border-gray-200 shadow-md rounded-lg px-3 py-2 text-xs text-gray-600 z-50'>
                    {text}
                </div>
            )}
        </div>
    );
}