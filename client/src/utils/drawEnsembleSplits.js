import * as d3 from "d3";
import { ME_COLORS } from "./constants";
import { drawAxes, drawGrid } from "./drawGridLines";
import { drawBars } from "./drawBars";

export default function drawEnsembleSplits({ givenSVG, data, margin, ensemble, racialGroup}){
    if (!ensemble) return;
    // create svg element
    var svg = d3.select(givenSVG).append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
            
        /* ------------------------------------------------------------------------ Dimensions */
        const width = givenSVG.clientWidth - margin.left - margin.right;
        const height = givenSVG.clientHeight - margin.top - margin.bottom;

        /* ------------------------------------------------------------------------ Data */
        const allEntries = ensemble === "both"
        ? [{ key: "raceBlind", label: "Race-Blind", series: data.raceBlind }, { key: "vra", label: "VRA", series: data.vra }]
        : [{ key: ensemble,    label: ensemble === "raceBlind" ? "Race-Blind" : "VRA", series: ensemble === "raceBlind" ? data.raceBlind : data.vra }];

        const allSeats = Array.from(new Set(
            allEntries.flatMap(entry => Object.keys(entry.series || {}).map(Number))
        )).sort((a, b) => a - b);
        const totalDistricts = data.totalDistricts;

        const getCount = (v) =>{
            if(!racialGroup) return 0;
            return v.splits?.[racialGroup] ?? 0;
        }

        const toEntries = (dataset) => Object.entries(dataset).map(([k, v]) => ({ x: +k, y: getCount(v) }));
        const maxCount = d3.max(allEntries.flatMap(entry => 
            Object.values(entry.series || {}).map(getCount)
        ));


        /* ------------------------------------------------------------------------ Axes */
        const x = d3.scaleBand()
        .domain(allSeats)
        .range([0, width])
        .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, (maxCount || 1) *1.1])
            .range([height, 0]);
          
        const xConfig = d3.axisBottom(x).tickFormat(d=>`${d}R/${totalDistricts - d}D`);
        const yConfig =  d3.axisLeft(y).ticks(4);
        drawGrid({ svg, width, height, x, xConfig, yConfig, hideX: true });

        drawAxes({
            svg, width, height, margin, 
            xLabel: "Republican / Democratic Split", 
            yLabel: "Count",
            xConfig, yConfig,
            small: true
        });


        /* ------------------------------------------------------------------------ Bars */
        const tooltipHTML = (label) => (d) => 
            `<strong>${label}</strong><br/>
            Split: ${d.x}R / ${totalDistricts - d.x}D<br/>
            Count: ${d.y.toLocaleString()}`;

        const half = x.bandwidth() / 2;

        allEntries.forEach(({ key, label, series }, i) => {
            drawBars({
                svg, x, y, height,
                tooltipHTML: tooltipHTML(label),
                entries: toEntries(series),
                barWidth: ensemble === "both" ? half : undefined,
                color: ME_COLORS[key],
                xOffset: ensemble === "both" ? i * half : 0,
                label,
            });
    });
}