import * as d3 from "d3";
import { getPrimarySecondaryColors } from "./constants";

export function drawEIAnalysis({ givenSVG, data, margin, racialLabel, candView }) {

    // find relevant racial group in file
    const candData = data.candidates.find(c => c.id === candView.toLowerCase());
    if (!candData) {
        console.error("Candidate not found:", candView);
        return;
    }

    var groupData = candData.groups[racialLabel];
    if (!groupData){
        console.error("Group data not found: ", racialLabel);
        return;
    }

    var raceDensity = groupData.density.group;
    var nonRaceDensity = groupData.density.complement;


    // create svg element
    var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
            
    /* ------------------------------------------------------------------ Axis Rendering */
    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;


    // Create x axis
    var x = d3.scaleLinear()
        .domain([0,1])        // axis ticks
        .range([0,width]);      // graph width 
        
    svg
        .append("g")
        .attr("class", "axisColor")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(4));      // axis tick spread
                
    // Create y axis
    const allY = [...raceDensity, ...nonRaceDensity].map(d => d.y);
    const maxY = d3.max(allY) * 1.1;
    var y = d3.scaleLinear()
        .domain([maxY, 0])
        .range([0, height]);

    svg
        .append("g")
        .attr("class", "axisColor")
        .call(d3.axisLeft(y).ticks(4));       // axis tick spread
        
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom-5)
        .text(`Proportion ${racialLabel}`)
        .attr("class", "capitalize-axis");

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left + 20)
        .text("Probability Value");
            
    /* ------------------------------------------------------------------ Plot Point Rendering */

    // define color assignment
    const legendColors = getPrimarySecondaryColors(racialLabel);
    const primaryColor = legendColors[0].color;
    const secondaryColor = legendColors[1].color;

    const areaGen = d3.area().curve(d3.curveBasis)
        .x(d => x(d.x))
        .y0(height)
        .y1(d => y(d.y));
        
    // selected race density
    svg.append("path")
        .attr("class", "mypath")
        .datum(raceDensity)
        .attr("fill", primaryColor)
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("d", areaGen);


    // non-selected race density
    svg.append("path")
        .attr("class", "mypath")
        .datum(nonRaceDensity)
        .attr("fill", secondaryColor)
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("d", areaGen);
}

