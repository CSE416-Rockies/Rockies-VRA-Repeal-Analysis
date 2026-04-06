import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom";

export default function NotFound(){
    const navigate = useNavigate();

    return(
        <div className = 'flex items-center justify-center w-full h-screen bg-gray-200'>
            <div className = 'flex flex-col p-10 gap-2 shadow-md bg-white rounded-xl'>
                <div className = 'flex items-center gap-2'>
                    <ExclamationTriangleIcon className = 'text-yellow-500 w-10 h-10'/>
                    <div className = 'capitalize font-bold text-xl'> Page not found </div>
                </div>
                <div> Please check that you have the correct URL and try again.</div>
                <div className = 'flex w-full justify-end'>
                    <button className = 'text-sm py-1 px-5 bg-gray-600 hover:bg-gray-500 transition-all ease-in text-white rounded-md' onClick = {()=> navigate(`/`)}>  OK </button>
                </div>
                
            </div>
        </div>
    )
}