import * as d3 from "d3";

export function drawBars({svg, height, x, y, entries, color, xOffset = 0, barWidth = x.bandwidth(), tooltipHTML }){

    if (!d3.select("#vra-tooltip").node()) {
        d3.select("body")
            .append("div")
            .attr("id", "vra-tooltip")
            .attr("class", "tooltip");
    }
    const tooltip = d3.select("#vra-tooltip"); 
    
    svg.selectAll(`.bar-${color.replace("#", "")}`)
        .data(entries)
        .join("rect")
        .attr("x", d => x(d.x) + xOffset)
        .attr("y", d => y(d.y))
        .attr("width", barWidth)
        .attr("height", d => Math.max(0, height - y(d.y)))
        .attr("fill", color)
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .on("mouseover", (event, d) => {
            tooltip.classed("visible", true)
                .html(tooltipHTML(d));
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", `${event.pageX + 12}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            tooltip.classed("visible", false);
        });

}