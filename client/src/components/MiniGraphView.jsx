import { useState, useRef, useContext } from "react"
import { createPortal } from "react-dom";
import { useD3 } from "../hooks/useD3";
import Legend from "./Legend";
import FullGraphView from "./FullGraphView";
import GlobalStoreContext from '../store';

import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";


export default function MiniGraphView({ title, drawFunc, data, racialGroup, margin, legendItems, extraProps = {}, children }) {
    const ref = useRef(null);
    const [fullScreen, setFullScreen] = useState(false);
    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";

    useD3(ref, (svg) => {
        if (!data || !racialGroup) return;
        drawFunc({ givenSVG: svg, data, margin, racialGroup, state: selectedState, ...extraProps });
    }, [data, racialGroup, extraProps, fullScreen, selectedState]);

    return (
        <>
        <div className='relative flex flex-col w-full h-full justify-center items-center gap-3 bg-white rounded-xl p-5'>
            <button 
                onClick = {()=> setFullScreen(true)}
                className = 'absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:scale-110 transition-all'
            >
                    <ArrowsPointingOutIcon className = 'w-4 h-4'/>
            </button>
            {children ? children :
            <div className='flex flex-col gap-2 w-full h-full justify-center items-center'>
                <div className='text-md capitalize font-semibold text-gray-700'>{title}</div>
            
                <div className='flex w-full h-full px-20 items-center'>
                    <div className = 'relative flex w-full h-full'>
                        {!fullScreen && <svg className='flex-1 block' width="100%" height="100%" ref={ref} />
                        }
                        <div className='absolute top-0 right-5 flex flex-col gap-4'>
                            {legendItems.length > 0 && <Legend items={legendItems} small = {true} />}
                        </div>
                    </div>
                </div>
            </div>
            }
            
        </div>

        {fullScreen && createPortal(
            <FullGraphView
                title={title}
                legendItems={legendItems}
                svgRef={ref}
                onClose={() => setFullScreen(false)}
            />,
            document.body
        )}

        </>
    )
}