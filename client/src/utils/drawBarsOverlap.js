import * as d3 from "d3";


export function drawBarsOverlap({svg, height, x, y, datasets, tooltipHTML}){
    if (!d3.select("#chart-tooltip").node()) {
        d3.select("body")
            .append("div")
            .attr("id", "chart-tooltip")
            .attr("class", "tooltip");
    }

    const tooltip = d3.select("#chart-tooltip");

    const combined = datasets.flatMap(({ entries, color, label }) =>
        entries.map(d => ({ ...d, color, label }))
    );

    // sort by bar height to draw taller one first (back)
    combined.sort((a, b) => b.y - a.y);            

    svg.selectAll(".bar-overlapping")
        .data(combined)
        .join("rect")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.max(0, height - y(d.y)))
        .attr("fill", d => d.color)
        .attr("stroke", d => d3.color(d.color).darker(1.5))
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .on("mouseover", (event, d) => {
            tooltip.classed("visible", true)
                .html(tooltipHTML(d.label)(d));
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