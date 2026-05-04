import * as d3 from "d3";

export function drawBisector({svg, width, height, x, data, onHover}){

    const bisectLine = svg.append("line")
        .attr("class", "bisector")
        .attr("y1", 0)                      
        .attr("y2", height)                
        .attr("opacity", 0)

    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }

    const bisect = d3.bisector(d => d.x).left;

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
        .on("mousemove", function(event) {
            const [mouseX] = d3.pointer(event);
            const xVal = x.invert(mouseX);

            const points = data.map(set => {
                const i = bisect(set.values, xVal);
                return {label: set.label, point: set.values[i]};
            });

            bisectLine
                .attr("x1", mouseX)
                .attr("x2", mouseX)
                .attr("opacity", 1);

            tooltip
                .classed("visible", true)
                .style("left", (event.pageX + 16) + "px")
                .style("top", (event.pageY - 28) + "px")
                .html(onHover({ xVal, points }));
        })
        .on("mouseleave", function() {
            bisectLine.attr("opacity", 0);
            tooltip.classed("visible", false);
        });
}