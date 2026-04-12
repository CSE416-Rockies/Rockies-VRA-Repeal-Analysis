import * as d3 from "d3";
import { getPrimarySecondaryColors } from "./constants";
import { drawAxes, drawGrid } from "./drawGridLines";

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
                
    // Create y axis
    const allY = [...raceDensity, ...nonRaceDensity].map(d => d.y);

    const maxY = d3.max(allY) * 1.1;
    var y = d3.scaleLinear()
        .domain([maxY, 0])
        .range([0, height]);

    const xConfig = d3.axisBottom(x).ticks(4);
    const yConfig = d3.axisLeft(y).ticks(4);

    /* -------------------------------------------------- grid lines */
    
    drawGrid({svg, width, height, xConfig, yConfig});
            
    /* ------------------------------------------------------------------ Plot Point Rendering */

    // define color assignment
    const legendColors = getPrimarySecondaryColors(racialLabel);
    const primaryColor = legendColors[0].color;
    const secondaryColor = legendColors[1].color;

    const areaGen = d3.area().curve(d3.curveBasis)
        .x(d => x(d.x))
        .y0(height)
        .y1(d => y(d.y));
        

    const curves = [
        {
            data: raceDensity,
            fill: primaryColor,
            label: racialLabel,
            mean: groupData.posteriorMean.group,
            ci: groupData.credibleInterval95.group
        },
        {
            data: nonRaceDensity,
            fill: secondaryColor,
            label: `Not ${racialLabel}`,
            mean: groupData.posteriorMean.complement,
            ci: groupData.credibleInterval95.complement
        }   
    ];

    
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }

    curves.forEach(curve => {
        svg.append("path")
            .attr("class", "kdeFill")
            .datum(curve.data)
            .attr("fill", curve.fill)
            .attr("stroke", d3.color(curve.fill).darker(1))
            .attr("d", areaGen)
            .on("mousemove", function(event) {
                tooltip.classed("visible", true)
                    .style("left", (event.pageX + 16) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .html(`
                        <strong style="text-transform: capitalize">${curve.label}</strong>
                        <div>Mean: ${curve.mean.toFixed(2)}</div>
                        <div>95% CI: [${curve.ci[0].toFixed(2)}, ${curve.ci[1].toFixed(2)}]</div>
                    `);
            })
            .on("mouseout", () => tooltip.classed("visible", false));
    });

    drawAxes({
        svg, width, height, margin, 
        xLabel: `Proportion ${racialLabel}`,
        yLabel: "Probability Value",
        xConfig: xConfig,
        yConfig: yConfig
        
    });
    
        
}



