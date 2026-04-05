import * as d3 from "d3";

export function drawAxes({ svg, width, height, margin, xLabel, yLabel, xConfig, yConfig, small = false}) {
    
    /* -------------------------------------------------- axes */

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

    // x axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", small ? height + margin.bottom - 5 : height + margin.bottom )
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "12px" : "16px")
        .text(xLabel);

    // y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("class", "axisColor capitalize-axis")
        .attr("font-size", small ? "12px" : "16px")
        .text(yLabel);
}


export function drawGrid({svg, width, height, xConfig, yConfig, hideX = false}){

    // clone xConfig/yConfig to leave actual variables untouched
    const yGrid = d3.axisLeft(yConfig.scale()).ticks(4).tickSize(-width).tickFormat("");
    const xGrid = d3.axisBottom(xConfig.scale()).ticks(4).tickSize(-height).tickFormat("");

    // horizontal lines
    const horizontalLines = svg.append("g")
        .attr("class", "gridColor")
        .call(yGrid);

    // vertical lines
    if (!hideX){
        const verticalLines = svg.append("g")
            .attr("class", "gridColor")
            .attr("transform", `translate(0,${height})`)
            .call(xGrid);
        verticalLines.select(".domain").remove();
    }
    
    // remove lines
    horizontalLines.select(".domain").remove();
}