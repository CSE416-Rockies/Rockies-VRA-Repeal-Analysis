
export function drawAxes({ svg, width, height, margin, xLabel, yLabel, xConfig, yConfig, small = false}) {

    // draw X axis
    const xAxis = svg.append("g")
        .attr("class", "axisColor")
        .attr("transform", `translate(0, ${height})`)
        .call(xConfig);

    xAxis.selectAll("text")
        .attr("font-size", small ? "12px" : "16px");
    
    // draw y axis
    const yAxis = svg.append("g")
        .attr("class", "axisColor")
        .call(yConfig);

    yAxis.selectAll("text")
        .attr("font-size", small ? "12px" : "16px");

    // X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", small ? height + margin.bottom - 5 : height + margin.bottom )
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "12px" : "16px")
        .text(xLabel);

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "12px" : "16px")
        .text(yLabel);
}