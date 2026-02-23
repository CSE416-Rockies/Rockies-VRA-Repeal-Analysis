import {ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

export default function DistrictDetail({expanded, onClick}){

    const districtArr = [
        {dNum: 1, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 2, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 3, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 4, rep: "Jane Doe", party: "democrat", racialGroup: "black", voteMargin: 30.81},
        {dNum: 5, rep: "Jane Doe", party: "republican", racialGroup: "other", voteMargin: 30.81},
        {dNum: 6, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 8, rep: "Jane Doe", party: "democrat", racialGroup: "black", voteMargin: 30.81},
        {dNum: 9, rep: "Jane Doe", party: "republican", racialGroup: "black", voteMargin: 30.81},
        {dNum: 10, rep: "Jane Doe", party: "democrat", racialGroup: "white", voteMargin: 30.81},
        {dNum: 11, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 12, rep: "Jane Doe", party: "republican", racialGroup: "latino", voteMargin: 30.81},
        {dNum: 13, rep: "Jane Doe", party: "republican", racialGroup: "white", voteMargin: 30.81},
        {dNum: 14, rep: "Jane Doe", party: "republican", racialGroup: "latino", voteMargin: 30.81}
    ];

    return(

        <div className = 'bg-white  rounded-2xl shadow-md flex flex-col w-full p-5 text-sm'>
            <div className = 'flex bg-white w-full justify-between text-xl text-gray-500 cursor-pointer' onClick = {onClick} >
                <div>District Detail</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>
        
            <div className={`flex justify-center overflow-scroll transition-all duration-700 ease-in-out ${expanded ? 'max-h-80 pt-5' : 'max-h-0'}`}>
                <table className = 'w-full'>
                    <thead className = 'text-left text-gray-400 '>
                        <tr>
                            <th>#</th>
                            <th>Representative</th>
                            <th>Party</th>
                            <th>Racial Group</th>
                            <th>Vote Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {districtArr.map(({dNum, rep, party, racialGroup, voteMargin}, index) => (
                        <tr key = {dNum} className = {`h-8 ${index%2==0? 'bg-gray-100':''}`} >
                                <td>{dNum}</td>
                                <td>{rep}</td>
                                <td >
                                    <span className = {`text-xs rounded-sm p-1 font-bold text-white ${party == "democrat"? 'bg-blue-500' : 'bg-red-500'}`}>
                                        {party == 'democrat'? 'DEM':'REP'}
                                    </span>                    
                                </td>
                                <td>{racialGroup}</td>
                                <td>{voteMargin}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    )

}