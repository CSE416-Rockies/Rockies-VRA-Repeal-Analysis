
export function drawAxes({ svg, width, height, margin, xLabel, yLabel, xConfig, yConfig, small = false}) {

    const xAxis = svg.append("g")
        .attr("class", "axisColor")
        .attr("transform", `translate(0, ${height})`)
        .call(xConfig);

    xAxis.selectAll("text")
        .attr("font-size", small ? "12px" : "16px")
        .attr("class", "capitalize-axis");
    
    const yAxis = svg.append("g")
        .attr("class", "axisColor")
        .call(yConfig);

    yAxis.selectAll("text")
        .attr("font-size", small ? "12px" : "14px")
        .attr("class", "capitalize-axis");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", small ? height + margin.bottom - 5 : height + margin.bottom - 10 )
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "10px" : "12px")
        .text(xLabel);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "10px" : "12px")
        .text(yLabel);
}