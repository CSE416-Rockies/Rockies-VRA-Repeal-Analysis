import * as d3 from "d3";
import { drawAxes } from "./drawAxes";
import { drawBars } from "./drawBars";
import { ME_COLORS } from "./constants";


export function drawEnsembleHistME({givenSVG, data, margin, racialGroup}){
    if (!givenSVG || !data) return;
        var svg = d3.select(givenSVG)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------- Dimensions */
    const width  = givenSVG.clientWidth  - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top  - margin.bottom;

    /* -------------------------------------------------------------------- Data Manipulation */
    
    const raceBlindEntries = Object.entries(data.raceBlind).map(([k, v]) => ({ x: +k, y: v[racialGroup] ?? 0 }));
    const vraEntries       = Object.entries(data.vra      ).map(([k, v]) => ({ x: +k, y: v[racialGroup] ?? 0 }));

    /* ------------------------------------------------------------------- Axes */
    const allX     = [...raceBlindEntries, ...vraEntries].map(d => d.x);
    const maxCount = d3.max([...raceBlindEntries, ...vraEntries], d => d.y);

    const x = d3.scaleBand()
        .domain(allX)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, (maxCount || 1) *1.1])
        .range([height, 0]);

    drawAxes({
        svg, width, height, margin, 
        xLabel: `# of ${racialGroup} effective districts`,
        yLabel: "# of plans",
        xConfig: d3.axisBottom(x),
        yConfig: d3.axisLeft(y).ticks(4),
        small: true
    });

    /* ------------------------------------------------------------------- Bars */

    const tooltipHTML = (label) => (d) => `
        <strong>${label}</strong><br/>
        Districts: ${d.x}<br/>
        Plans: ${d.y.toLocaleString()}
    `;
    
    drawBars({
        svg, x, y, height,
        entries: raceBlindEntries,
        color: ME_COLORS["raceBlind"],
        label: "Race-Blind",
        opacity: .55,
        tooltipHTML: tooltipHTML("Race-Blind"),
    });

    drawBars({
        svg, x, y, height,
        entries: vraEntries,
        color: ME_COLORS["vra"],
        label: "VRA-Constrained",
        opacity: .55,
        tooltipHTML: tooltipHTML("VRA-Constrained"),
    });

    

}