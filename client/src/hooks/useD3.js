import { useEffect } from "react";
import * as d3 from "d3";

export function useD3(ref, drawFunc, deps = []){

    useEffect(()=>{

        const element = ref.current;
        if (!element) return;

        function redraw(){
            d3.select(element).selectAll("*").remove();                // prevent rendering on top of each other
            drawFunc(element);
        }

        const obsvr = new ResizeObserver(redraw);
        obsvr.observe(element);
        redraw();

        return ()=> {
            obsvr.unobserve(element);
            obsvr.disconnect();
        }

    }, deps)
    
}