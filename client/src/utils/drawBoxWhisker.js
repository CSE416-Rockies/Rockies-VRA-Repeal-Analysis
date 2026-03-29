import * as d3 from "d3";
import { drawBox } from "./drawBox";
import { drawAxes } from "./drawAxes";

export function drawBoxWhisker({ givenSVG, data, margin, racialLabel }) {
    if(!givenSVG) return;
    const svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Dimensions */

    // console.log("in draw boxwhisker, clientWidth: ", givenSVG.clientWidth, " clientHeight: ", givenSVG.clientHeight);
    const width  = givenSVG.clientWidth  - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top  - margin.bottom;

    const n          = data.length;
    const bandwidth  = Math.max(8, Math.min(40, (width / n) * 0.6));  

    /* ------------------------------------------------------------------ Scales */
    // X: one position per indexed district
    const x = d3.scaleLinear()
        .domain([0.5, n + 0.5])
        .range([0, width]);

    // Y: percentage 0–100
    const allVals = data.flatMap(d => [d.min, d.max, d.enacted]);
    const yMin = Math.max(0,   d3.min(allVals) - 0.05);
    const yMax = Math.min(1,   d3.max(allVals) + 0.05);

    const y = d3.scaleLinear()
        .domain([yMax, yMin])
        .range([0, height]);

    /* ------------------------------------------------------------------ Axes */

    drawAxes({
        svg, width, height, margin,
        xConfig: d3.axisBottom(x).ticks(n).tickFormat(d => Number.isInteger(d) ? d : ""),
        yConfig: d3.axisLeft(y).ticks(6).tickFormat(d => `${Math.round(d * 100)}%`),
        xLabel: "Indexed Districts",
        yLabel: `${racialLabel} Population Share`
    });

    /* ------------------------------------------------------------------ Box & Whisker Groups */
    const boxGroup = svg.append("g").attr("class", "boxes");

    data.forEach((d, i) => {
        const cx = x(i + 1);  // center x for this district

        drawBox(boxGroup, {cx, bandwidth, y, d, color: "white"});

         // ── Enacted dot ────────────────────────────────────────────────
        boxGroup.append("circle")
            .attr("cx", cx)
            .attr("cy", y(d.enacted))
            .attr("r", Math.max(3, bandwidth * 0.18))
            .attr("fill", "#10B981")
            .attr("stroke", "white")
            .attr("stroke-width", 1);
    });
}