import * as d3 from "d3";
import { ME_COLORS } from "./constants";
import { drawAxes } from "./drawAxes";
import { drawBars } from "./drawBars";

export default function drawEnsembleSplits({ givenSVG, data, margin, candView, racialGroup}){
    // create svg element
        var svg = d3.select(givenSVG).append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
              
            
        /* ------------------------------------------------------------------------ Dimensions */
        const width = givenSVG.clientWidth - margin.left - margin.right;
        const height = givenSVG.clientHeight - margin.top - margin.bottom;

        const allEntries = candView === "both" ? [...Object.entries(data.raceBlind), ...Object.entries(data.vra)]
        : Object.entries(candView === "raceBlind" ? data.raceBlind : data.vra);

        const allSeats = Array.from(new Set(allEntries.map(([k]) => +k))).sort((a, b) => a - b);

        const totalDistricts = data.totalDistricts;

        const getCount = (v) =>{
            if(!racialGroup) return 0;
            return v[racialGroup];
        }
        const maxCount = d3.max(allEntries, ([, v]) => getCount(v));


        /* ------------------------------------------------------------------------ Axes */
        const x = d3.scaleBand()
        .domain(allSeats)
        .range([0, width])
        .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, (maxCount || 1) *1.1])
            .range([height, 0]);
            
        drawAxes({
            svg, width, height, margin, 
            xLabel: "Republican / Democratic Split", 
            yLabel: "Count",
            xConfig: d3.axisBottom(x).tickFormat(d=>`${d}R/${totalDistricts - d}D`),
            yConfig: d3.axisLeft(y).ticks(4)
        });


        /* ------------------------------------------------------------------------ Bars */
        const toEntries = (dataset) => Object.entries(dataset).map(([k, v]) => ({ x: +k, y: getCount(v) }));
        const tooltipHTML = (label) => (d) => 
            `<strong>${label}</strong><br/>
            Split: ${d.x}R / ${totalDistricts - d.x}D<br/>
            Count: ${d.y.toLocaleString()}`;

        if (candView === "both") {
            const half = x.bandwidth() / 2;
            drawBars({
                svg, x, y, height, 
                tooltipHTML: tooltipHTML("Race-Blind"),
                entries: toEntries(data.raceBlind),
                barWidth: half, 
                color: ME_COLORS["raceBlind"],
                xOffset: 0,
                label: "Race-Blind",
            } );

            drawBars({
                svg, x, y, height, 
                tooltipHTML: tooltipHTML("VRA"),
                entries: toEntries(data.vra),
                barWidth: half, 
                color: ME_COLORS["vra"],
                xOffset: half,
                label: "VRA"
            } )

        } else {
            const dataset = candView === "raceBlind" ? data.raceBlind : data.vra;
            const label = candView === "raceBlind" ? "Race-Blind" : "VRA";
            drawBars({
                svg, x, y, height, 
                tooltipHTML: tooltipHTML(label),
                entries: toEntries(dataset),
                color: ME_COLORS[candView],
                label: label
            } );
        }
}