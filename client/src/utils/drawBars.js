import * as d3 from "d3";

export function drawBars({svg, height, x, y, entries, color, xOffset = 0, barWidth = x.bandwidth(), opacity = 1, tooltipHTML }){

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
        .attr("x", d => x(d.x) + xOffset)
        .attr("y", d => y(d.y))
        .attr("width", barWidth)
        .attr("height", d => height - y(d.y))
        .attr("fill", color)
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                .html(tooltipHTML(d));
            d3.select(event.currentTarget)
                .attr("opacity", opacity)
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

}