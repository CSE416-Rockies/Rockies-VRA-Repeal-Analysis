import { XMarkIcon } from "@heroicons/react/24/solid";
import Legend from "./Legend";


export default function FullGraphView({title, svgRef, onClose, legendItems}){


    return(
        <div className = 'fixed inset-0 flex z-50 items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto fullscreen-back'
            onMouseDown={onClose}
        >
            <div className = 'relative flex flex-col bg-white rounded-xl p-5 gap-5 w-10/12 h-5/6 fullscreen-panel'
                style = {{marginLeft: 'var(--navbar-width)'}}
                onMouseDown={e => e.stopPropagation()} 
            >
                <button onClick = {onClose}
                    className = 'absolute top-5 right-5 text-gray-400 hover:text-red-500 hover:scale-125 transition-all'
                >
                    <XMarkIcon className = 'w-5 h-5' />
                </button>

                <div className='text-lg font-lg capitalize text-center font-medium'>{title}</div>
                <div className='flex w-full h-full px-10 items-center'>
                    <svg className='flex-1 block' width="100%" height="100%" ref={svgRef} />
                    {legendItems.length > 0 && <Legend items={legendItems} small={false} />}
                </div>

            </div>
            
        </div>

    )
}

