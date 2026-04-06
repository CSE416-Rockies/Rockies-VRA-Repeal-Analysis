import {InformationCircleIcon} from '@heroicons/react/24/solid'

export default function Tooltip({desc, plain = false}){

    return(
        plain ?
        <span className='absolute left-0 top-5 z-50 hidden group-hover:block bg-black opacity-85 text-white text-xs rounded-md px-3 py-2 
                         w-40 shadow-lg pointer-events-none'>
            {desc}
        </span>
        :
        <div className = 'absolute flex items-center top-full left-2 mt-1 bg-white rounded-md gap-1 px-3 py-1 shadow-sm border-yellow-500 border-2 z-20'>
            <div className = 'w-5 text-yellow-500'>
                <InformationCircleIcon />
            </div>
            <div className = 'text-sm'>
                {desc}
            </div>
            <div className="absolute -top-1 w-2 h-2 bg-white rotate-45 border-yellow-500 border-l-2 border-t-2 z-0" />
        </div>
        
    )

}