import * as d3 from "d3";
import { drawAxes, drawGrid } from "./drawGridLines";
import { drawBars} from "./drawBars";
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
    const raceBlindEntries = Object.entries(data.raceBlind[racialGroup]).map(([k, v]) => ({ x: +k, y: v }));
    const vraEntries = Object.entries(data.vra[racialGroup]).map(([k,v]) => ({x: +k, y: v}));

    /* ------------------------------------------------------------------- Axes */
    const allX     = [...raceBlindEntries, ...vraEntries].map(d => d.x);
    const maxCount = d3.max([...raceBlindEntries, ...vraEntries], d => d.y);

    const x = d3.scaleBand()
        .domain(allX)
        .range([0, width])
        .padding(0);

    const y = d3.scaleLinear()
        .domain([0, (maxCount || 1) *1.1])
        .range([height, 0]);

    const xConfig = d3.axisBottom(x);
    const yConfig =  d3.axisLeft(y).ticks(4);

    drawGrid({svg, width, height, x, xConfig, yConfig, hideX:true});
    drawAxes({
        svg, width, height, margin, xConfig, yConfig,
        xLabel: `# of ${racialGroup} effective districts`,
        yLabel: "# of plans",
        small: true
    });

    /* ------------------------------------------------------------------- Bars */

    const tooltipHTML = (label) => (d) => `
        <strong>${label}</strong><br/>
        Districts: ${d.x}<br/>
        Plans: ${d.y.toLocaleString()}
    `;

    const datasets = [
        { entries: raceBlindEntries, color: ME_COLORS["raceBlind"], label: "Race-Blind"},
        { entries: vraEntries, color: ME_COLORS["vra"], label: "VRA-Constrained"}
    ].sort((a,b)=> d3.max(b.entries, d=> d.y) - d3.max(a.entries, d=>d.y));
    
    datasets.forEach(({entries, color, label})=>{
        drawBars({ svg, x, y, height, entries, color, tooltipHTML: tooltipHTML(label) });
    })

}