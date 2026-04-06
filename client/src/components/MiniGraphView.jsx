import { useState, useRef } from "react"
import { createPortal } from "react-dom";
import { useD3 } from "../hooks/useD3";
import Legend from "./Legend";
import FullGraphView from "./FullGraphView";

import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";


export default function MiniGraphView({ title, drawFunc, data, racialGroup, margin, legendItems, extraProps = {} }) {
    const ref = useRef(null);
    const [fullScreen, setFullScreen] = useState(false);

    useD3(ref, (svg) => {
        if (!data || !racialGroup) return;
        drawFunc({ givenSVG: svg, data, margin, racialGroup, ...extraProps });
    }, [data, racialGroup, extraProps, fullScreen]);

    return (
        <>
        <div className='relative flex flex-col w-full h-1/2 justify-center items-center gap-3 bg-white rounded-xl p-5'>
            <button 
                onClick = {()=> setFullScreen(true)}
                className = 'absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:scale-110 transition-all'
            >
                    <ArrowsPointingOutIcon className = 'w-4 h-4'/>
            </button>
            <div className='flex flex-col gap-2 w-full h-full justify-center items-center'>
                <div className='text-md capitalize'>{title}</div>
            
                <div className='flex w-full h-full px-20 items-center'>
                    {!fullScreen && <svg className='flex-1 block' width="100%" height="100%" ref={ref} />}
                    {legendItems.length > 0 && <Legend items={legendItems} small = {true} />}
                </div>
            </div>
            
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