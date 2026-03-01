import { ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid"

export default function PageControls({currPage, prev, next, hasPrev, hasNext}){

    return(

        <div className = 'flex items-center absolute bottom-5 justify-center gap-5 rounded-lg text-gray-700 bg-white border-2 border-gray-200 px-5'>
            <button onClick = {prev} className = {`${hasPrev ? " hover:text-gray-500 p-1" : "text-gray-300 pointer-events-none"}`}>
                <BackwardIcon className = 'w-5'/>
            </button>
            <div className = 'text-md'>{currPage}</div>
            <button onClick = {next} className = {`${hasNext ? "hover:text-gray-500 p-1" : "text-gray-300 pointer-events-none"}`}>
                <ForwardIcon className = 'w-5'/>
            </button>
        </div>
    )
}
