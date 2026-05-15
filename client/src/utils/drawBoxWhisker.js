import * as d3 from "d3";
import { drawBox } from "./drawBox";
import { drawAxes, drawGrid } from "./drawGridLines";
import { ME_COLORS } from "./constants";
import { toPercent } from "./helpers";
import { bindTooltip } from "./tooltip";

export function drawBoxWhisker({ givenSVG, data, margin, racialGroup, ensemble }) {
    if(!givenSVG) return;  
    
    const svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Dimensions */

    const width  = givenSVG.clientWidth  - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top  - margin.bottom;

    /* ------------------------------------------------------------------- Data */
    const raceBlind = data?.raceBlind?.[racialGroup] ?? [];
    const vra = data?.vra?.[racialGroup] ?? [];

    const ALL_ENTRIES = [
        { key: "raceBlind", label: "Race-Blind", series: raceBlind },
        { key: "vra", label: "VRA", series: vra }
    ];

    const allEntries = (!ensemble || ensemble === "both")
    ? ALL_ENTRIES
    : ALL_ENTRIES.filter(d => d.key === ensemble);

    const n = vra.length;

    /* ------------------------------------------------------------------ Scales */

    const xOuter = d3.scaleBand()
    .domain(d3.range(1, n + 1))   
    .range([0, width])
    .padding(0.1);

    const xInner = d3.scaleBand()
        .domain(allEntries.map(d => d.key))
        .range([0, xOuter.bandwidth()])
        .padding(0.2);

    const allVals = allEntries.flatMap(({ series }) => series.flatMap(d => [d.min, d.max, d.enacted]));
    const yMin = Math.max(0,   d3.min(allVals) - 0.05);
    const yMax = Math.min(1,   d3.max(allVals) + 0.05);

    const y = d3.scaleLinear()
        .domain([yMax, yMin])
        .range([0, height]);

    /* ------------------------------------------------------------------ Axes */
    const xConfig = d3.axisBottom(xOuter).tickFormat(d => Number.isInteger(d) ? d : "");
    const yConfig =  d3.axisLeft(y).ticks(6).tickFormat(d => `${Math.round(d * 100)}%`);

    drawGrid({svg, width, xOuter, height, xConfig, yConfig, hideX: true});
    drawAxes({
        svg, width, height, margin, xConfig, yConfig,
        xLabel: "Indexed Districts",
        yLabel: `${racialGroup} Population Share`,
        small: true
    });

    /* ------------------------------------------------------------------ Box & Whisker Groups */
    const boxGroup = svg.append("g").attr("class", "boxes");
    const tooltipHTML = (label) => (d) =>
        `<strong>${label}</strong><br/>
        Max: ${toPercent(d.max)}%<br/>
        Q3: ${toPercent(d.q3)}%<br/>
        Median: ${toPercent(d.median)}%<br/>
        Q1: ${toPercent(d.q1)}%<br/>
        Min: ${toPercent(d.min.toFixed(2))}%`;

    allEntries.forEach(({ key, label, series }) => {
        series.forEach((d,i)=> {
            const cx = xOuter(i + 1) + xInner(key) + xInner.bandwidth() / 2;
            const bandwidth = xInner.bandwidth();
            drawBox(boxGroup, {cx, bandwidth, y, d, color: ME_COLORS[key], tooltipHTML: tooltipHTML(label)});

        // enacted point
       const enactedPt = boxGroup.append("circle")
            .attr("cx", cx)
            .attr("cy", y(d.enacted))
            .attr("r", Math.max(4))
            .attr("fill", ME_COLORS["enacted"])
            .attr("stroke", "white")
            .attr("stroke-width", 1);

            bindTooltip(enactedPt, () => `<strong>Enacted</strong><br/>Population Share: ${toPercent(d.enacted)}%`);
        })
        

        
    });
}