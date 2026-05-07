import * as d3 from "d3";

export function getOrCreateTooltip() {
    if (!d3.select("#chart-tooltip").node()) {
        d3.select("body")
            .append("div")
            .attr("id", "chart-tooltip")
            .attr("class", "tooltip");
    }
    return d3.select("#chart-tooltip");
}

export function bindTooltip(selection, tooltipHTML) {
    const tooltip = getOrCreateTooltip();

    selection
        .on("mouseover", function(event, d) {
            tooltip.classed("visible", true).html(tooltipHTML(d));
            tooltip.style("left", event.pageX + 12 + "px")
                   .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", event.pageX + 12 + "px")
                   .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function() {
            tooltip.classed("visible", false);
        });
}