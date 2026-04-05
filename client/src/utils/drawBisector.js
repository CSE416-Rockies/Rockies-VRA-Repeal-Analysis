import * as d3 from "d3";

export function drawBisector({svg, width, height, x, data, onHover}){

    // bisector
    const bisectLine = svg.append("line")
        .attr("class", "bisector")
        .attr("y1", 0)                      // line start
        .attr("y2", height)                 // line end
        .attr("opacity", 0)

    // tooltip
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }

    // 3. invisible overlay to catch mouse events
    const bisect = d3.bisector(d => d.x).left;

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
        .on("mousemove", function(event) {
            const [mouseX] = d3.pointer(event);
            const xVal = x.invert(mouseX);

            // find nearest data point
            const points = data.map(set => {
                const i = bisect(set.values, xVal);
                return {label: set.label, point: set.values[i]};
            });

            // move the vertical line
            bisectLine
                .attr("x1", mouseX)
                .attr("x2", mouseX)
                .attr("opacity", 1);

            // show tooltip
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