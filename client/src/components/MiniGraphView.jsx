import { useRef } from "react"
import { useD3 } from "../hooks/useD3";
import Legend from "./Legend";

export default function MiniGraphView({ title, drawFunc, data, racialGroup, margin, legendItems }) {
    const ref = useRef(null);

    useD3(ref, (svg) => {
        if (!data || !racialGroup) return;
        drawFunc({ givenSVG: svg, data, margin, racialGroup });
    }, [data, racialGroup]);

    return (
        <div className='flex flex-col w-full h-1/2 justify-center items-center gap-3 bg-white rounded-xl p-5'>
            <div className='flex flex-col gap-2 justify-center items-center'>
                <div className='text-md capitalize'>{title}</div>
            </div>
            <div className='flex w-full h-full px-20 items-center'>
                <svg className='flex-1 block' width="100%" height="100%" ref={ref} />
                {legendItems.length > 0 && <Legend items={legendItems} small = {true} />}
            </div>
        </div>
    )
}