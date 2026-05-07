import * as d3 from "d3";
import { bindTooltip } from "./tooltip";

export function drawBars({svg, height, x, y, entries, color, xOffset = 0, barWidth = x.bandwidth(), tooltipHTML }){

    if (!d3.select("#chart-tooltip").node()) {
        d3.select("body")
            .append("div")
            .attr("id", "chart-tooltip")
            .attr("class", "tooltip");
    }
    
    const bars = svg.selectAll(`.bar-${color.replace("#", "")}`)
        .data(entries)
        .join("rect")
        .attr("x", d => x(d.x) + xOffset)
        .attr("y", d => y(d.y))
        .attr("width", barWidth)
        .attr("height", d => Math.max(0, height - y(d.y)))
        .attr("fill", color)
        .attr("fill-opacity", 0.5)
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);
    
    bindTooltip(bars, tooltipHTML);


}