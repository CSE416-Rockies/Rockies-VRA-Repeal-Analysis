import * as d3 from "d3";
import { getCandidateColors , PARTY_COLORS, PARTY_REFS} from "./constants";
import { drawAxes, drawGrid } from "./drawGridLines";

export function drawEIAnalysis({ givenSVG, data, margin, racialLabel, candView }) {

    if (candView === "compare") {
        drawEICompare({ givenSVG, data, margin, racialLabel });
        return;
    }

    let candVarName = PARTY_REFS[candView].key;
    console.log(candView);
    const candData = data.candidates[candVarName];
    if (!candData) {
        console.error("Candidate not found:", candData);
        return;
    }

    var groupData = candData.groups[racialLabel];
    if (!groupData){
        console.error("Group data not found: ", racialLabel);
        return;
    }

      console.log(groupData);

    var raceDensity = groupData.density.group;
    var nonRaceDensity = groupData.density.complement;

    var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
            
    /* ------------------------------------------------------------------ Axis Rendering */
    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([0,1])        
        .range([0,width]);      
                
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

    const legendColors = getCandidateColors(racialLabel, candView);
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
            mean: groupData.posterior_mean.group,
            ci: groupData.credible_interval_95.group
        },
        {
            data: nonRaceDensity,
            fill: secondaryColor,
            label: `Not ${racialLabel}`,
            mean: groupData.posterior_mean.complement,
            ci: groupData.credible_interval_95.complement
        }   
    ];

    console.log(curves);
    
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


function drawEICompare({ givenSVG, data, margin, racialLabel }){
    const candidates = Object.entries(data.candidates); 

     var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Axis Rendering */
    const width  = givenSVG.clientWidth  - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top  - margin.bottom;

    var x = d3.scaleLinear()
        .domain([0,1])          
        .range([0,width]);     
                
    const allY = candidates.flatMap(([, cand]) =>
        (cand.groups[racialLabel]?.density.group ?? []).map(d => d.y)
    );

    const maxY = d3.max(allY) * 1.1;
    var y = d3.scaleLinear()
        .domain([maxY, 0])
        .range([0, height]);

    const xConfig = d3.axisBottom(x).ticks(4);
    const yConfig = d3.axisLeft(y).ticks(4);

    drawGrid({ svg, width, height, xConfig, yConfig });

    /* ------------------------------------------------------------------ Draw Curve */

    const areaGen = d3.area().curve(d3.curveBasis)
        .x(d => x(d.x))
        .y0(height)
        .y1(d => y(d.y));

    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }

    candidates.forEach( ([candKey, candData]) => {
        const groupData = candData.groups[racialLabel];
        if (!groupData) return;
 
        const color = candKey === 'democrat' ? PARTY_COLORS.dem : PARTY_COLORS.rep;
 
        svg.append("path")
            .attr("class", "kdeFill")
            .datum(groupData.density.group)
            .attr("fill", color)
            .attr("fill-opacity", 0.35)
            .attr("stroke", d3.color(color).darker(1))
            .attr("d", areaGen)
            .on("mousemove", function(event) {
                tooltip.classed("visible", true)
                    .style("left", (event.pageX + 16) + "px")
                    .style("top",  (event.pageY - 28) + "px")
                    .html(`
                        <strong style="text-transform:capitalize">${candKey}</strong>
                        <div>Mean: ${groupData.posterior_mean.group.toFixed(2)}</div>
                        <div>95% CI: [${groupData.credible_interval_95.group[0].toFixed(2)}, ${groupData.credible_interval_95.group[1].toFixed(2)}]</div>
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