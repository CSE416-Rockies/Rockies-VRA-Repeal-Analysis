import { XCircleIcon } from '@heroicons/react/24/solid'


export default function StateSelection(){
    
    return(

        <div className = " fixed right-5 top-5 flex flex-col bg-white rounded-2xl shadow-md w-96 pt-4 border-divide">

            <div className = "flex justify-between items-center pb-4 px-4">
                <span className = 'flex gap-2'>
                    <span className = "text-gray-400">Selected:</span>
                    <span className = "font-bold">Delaware</span>
                </span>
                <XCircleIcon className = 'text-red-500 w-7 transition-transform transition-duration-700 ease-in-out hover:scale-125'/>
            </div>

            <div className = "flex justify-between divide-x divide-gray-300">
                <div className = "px-4 pt-4 pb-4">
                    <div className = "text-gray-400 text-xs">DISTRICT PLANS</div>
                    <div className = "font-bold text-lg">15</div>
                </div>

                <div className = "px-4 pt-4">
                    <div className = "text-gray-400 text-xs">POPULATION THRESHOLD</div>
                    <div className = "font-bold text-lg">10%</div>
                </div>
            </div>
            
            

            
            
        </div>
    )
}