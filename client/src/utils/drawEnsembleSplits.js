import * as d3 from "d3";
import { ENSEMBLE_LEGEND } from "./constants";

export default function drawEnsembleSplits({ givenSVG, data, margin, candView, racialGroup}){
    // create svg element
        var svg = d3.select(givenSVG).append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
                
        const width = givenSVG.clientWidth - margin.left - margin.right;
        const height = givenSVG.clientHeight - margin.top - margin.bottom;

        const colorMap = Object.fromEntries(ENSEMBLE_LEGEND.map(d => [d.label, d.color]));

        const entries = candView === "both" ? [...Object.entries(data.raceBlind), ...Object.entries(data.vra)]
        : Object.entries(candView === "race-blind" ? data.raceBlind : data.vra);

        const allSeats = Array.from(new Set(entries.map(([k]) => +k))).sort((a, b) => a - b);

        const totalDistricts = data.totalDistricts;

        const getCount = (v) =>{
            if(!racialGroup) return 0;
            return v[racialGroup];
        }
        const maxCount = d3.max(entries, ([, v]) => getCount(v));

        const x = d3.scaleBand()
        .domain(allSeats)
        .range([0, width])
        .padding(0.1);

        svg
            .append("g")
            .attr("class", "axisColor")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d=>`${d}R/${totalDistricts - d}D`));

        const y = d3.scaleLinear()
            .domain([0, (maxCount || 1) *1.1])
            .range([height, 0]);
            
        svg
            .append("g")
            .attr("class", "axisColor")
            .call(d3.axisLeft(y).ticks(4));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + margin.bottom-5)
            .text(`Republican / Democratic Split`);

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 20)
            .text("Count");


        const drawBars = (dataset, color, label, xOffset = 0, barWidth = x.bandwidth()) => {
            const entries = Object.entries(dataset).map(([k, v]) => ({ seats: +k, count: getCount(v) }));

            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip-ensemble") 
                .style("position", "absolute")
                .style("background", "rgba(0,0,0,0.75)")
                .style("color", "white")
                .style("padding", "6px 10px")
                .style("border-radius", "6px")
                .style("font-size", "13px")
                .style("pointer-events", "none")
                .style("opacity", 0);

            svg.selectAll(`.bar-${color.replace("#", "")}`)
                .data(entries)
                .join("rect")
                .attr("x", d => x(d.seats) + xOffset)
                .attr("y", d => y(d.count))
                .attr("width", barWidth)
                .attr("height", d => height - y(d.count))
                .attr("fill", color)
                .attr("stroke", "#000")
                .attr("stroke-width", 2)
                .attr("opacity", 0.8)
                .on("mouseover", (event, d) => {
                    tooltip.style("opacity", 1)
                        .html(`<strong>${label}</strong><br/>Split: ${d.seats}R / ${data.totalDistricts - d.seats}D<br/>Frequency: ${d.count}`);
                    d3.select(event.currentTarget)
                        .attr("opacity", 1)
                        .attr("stroke-width", 3);
                })
                .on("mousemove", (event) => {
                    tooltip
                        .style("left", `${event.pageX + 12}px`)
                        .style("top",  `${event.pageY - 28}px`);
                })
                .on("mouseout", (event) => {
                    tooltip.style("opacity", 0);
                    d3.select(event.currentTarget)
                        .attr("opacity", 0.7)
                        .attr("stroke-width", 2);
                });
        };

        if (candView === "both") {
            const half = x.bandwidth() / 2;
            drawBars(data.raceBlind, colorMap["race-blind"], "Race-Blind", 0, half);
            drawBars(data.vra, colorMap["VRA"], "VRA", half, half);
        } else {
            const dataset = candView === "race-blind" ? data.raceBlind : data.vra;
            const label = candView === "race-blind" ? "Race-Blind" : "VRA";
            drawBars(dataset, colorMap[candView], label);
        }
}