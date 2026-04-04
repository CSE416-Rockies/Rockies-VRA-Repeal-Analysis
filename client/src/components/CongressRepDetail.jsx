import { usePaginate } from "../hooks/usePaginate";
import { PARTY_COLORS } from "../utils/constants";
import { normalizeParty } from "../utils/helpers";
import PageControls from './PageControls';
import { UserIcon } from "@heroicons/react/24/solid";

export default function CongressRepDetail({repArr, onClick}){
    const perPage = 4;
    const {onPage, currPage, goPrev, goNext, hasPrev, hasNext, _ } = usePaginate(repArr, perPage);

    return(
        <div className = 'flex flex-col gap-5 justify-between items-center px-2'>
            <div className = 'grid grid-cols-2 gap-5 w-full' onClick = {onClick}>

                {onPage.map(({districtNumber, name, party, imageId, status})=>(
                    <div className = 'flex gap-2' key = {`${districtNumber}-${onPage}`}>
                        { status == "Vacant" ? 
                            <div className = 'flex justify-center items-center rounded-md w-16 h-20 bg-gray-200'>
                                <UserIcon className = 'w-10 text-gray-500'/>
                            </div>
                            :   
                             <img src = {`/imgs/representatives/${imageId}.jpg`} className = 'w-16 h-20 object-cover rounded-md'/>
                        }
                        <div className = 'flex flex-col gap-0.5 justify-center'>
                            <div className = 'text-sm font-semibold'>{name ?? "Vacant"}</div>
                            <div className = 'text-xs text-gray-500'>District {districtNumber}</div>
                            <div className = "text-xs capitalize rounded-xl"
                                style={{ color: PARTY_COLORS[normalizeParty(party)]}}>
                                {party ?? ""}
                            </div>
                        </div>
                        
                    </div>
                ))}

            </div>
                <PageControls currPage = {currPage} prev = {goPrev} next = {goNext} hasPrev = {hasPrev} hasNext = {hasNext}/>
        </div>
    )
}