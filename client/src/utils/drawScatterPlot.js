import * as d3 from "d3";
import { PARTY_COLORS } from "./constants";

export function drawScatterPlot({ givenSVG, data, margin, racialLabel }) {

    // create svg element
    var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
            
    /* ------------------------------------------------------------------ Axis Rendering */
    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;

    // Create x axis
    var x = d3.scaleLinear()
        .domain([0,100])        // axis ticks
        .range([0,width]);      // graph width 
    svg
        .append("g")
        .attr("class", "axisColor")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(4).tickFormat(d=>`${d}%`));      // axis tick spread
                
    // Create y axis
    var y = d3.scaleLinear()
        .domain([100,0])        // axis ticks
        .range([0,height]);     // graph height
    svg
        .append("g")
        .attr("class", "axisColor")
        .call(d3.axisLeft(y).ticks(4).tickFormat(d=>`${d}%`));       // axis tick spread
        
        // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom)
        .text(`Percent ${racialLabel}`);

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left + 20)
        .text("Vote Shares");
            
    /* ------------------------------------------------------------------ Plot Point Rendering */

    // define color assignment by political party
    var color = d3.scaleOrdinal() 
        .domain(['rep', 'dem'])
        .range([PARTY_COLORS.rep, PARTY_COLORS.dem])

    // Scatter dots
    svg.append('g')
        .selectAll("dot")
        .data(data)                                     // bind data to dots
        .join("circle")                                 // create circle
            .attr("cx", d => x(d.racial_pct))
            .attr("cy", d => y(d.vote_share) )
            .attr("r", 2)
            .style("fill",  d => color(d.party))
    
}