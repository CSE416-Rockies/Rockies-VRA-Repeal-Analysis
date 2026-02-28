import * as d3 from "d3";

export function drawBoxWhisker({ givenSVG, data, margin, racialLabel }) {

    const svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Dimensions */
    const width  = givenSVG.clientWidth  - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top  - margin.bottom;

    const n          = data.length;
    const bandwidth  = Math.max(8, Math.min(40, (width / n) * 0.6));  

    /* ------------------------------------------------------------------ Scales */
    // X: one position per indexed district
    const x = d3.scaleLinear()
        .domain([0.5, n + 0.5])
        .range([0, width]);

    // Y: percentage 0–100
    const allVals = data.flatMap(d => [d.min, d.max, d.enacted]);
    const yMin = Math.max(0,   d3.min(allVals) - 0.05);
    const yMax = Math.min(1,   d3.max(allVals) + 0.05);

    const y = d3.scaleLinear()
        .domain([yMax, yMin])
        .range([0, height]);

    /* ------------------------------------------------------------------ Axes */
    svg.append("g")
        .attr("class", "axisColor")
        .attr("transform", `translate(0, ${height})`)
        .call(
            d3.axisBottom(x)
                .ticks(n)
                .tickFormat(d => Number.isInteger(d) ? d : "")
        );

    svg.append("g")
        .attr("class", "axisColor")
        .call(
            d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d => `${Math.round(d * 100)}%`)
        );

    // X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("class", "axisColor")
        .text("Indexed Districts");

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("class", "axisColor")
        .text(`${racialLabel.charAt(0).toUpperCase() + racialLabel.slice(1)} Population Share`);

    /* ------------------------------------------------------------------ Box & Whisker Groups */
    const boxGroup = svg.append("g").attr("class", "boxes");

    data.forEach((d, i) => {
        const cx = x(i + 1);  // center x for this district

        // ── Whisker line (min to max) ──────────────────────────────────
        boxGroup.append("line")
            .attr("x1", cx).attr("x2", cx)
            .attr("y1", y(d.min)).attr("y2", y(d.max))
            .attr("stroke", "#555")
            .attr("stroke-width", 1.5);

        // ── Whisker caps ───────────────────────────────────────────────
        const capW = bandwidth * 0.4;

        // min cap
        boxGroup.append("line")
            .attr("x1", cx - capW).attr("x2", cx + capW)
            .attr("y1", y(d.min)).attr("y2", y(d.min))
            .attr("stroke", "#555")
            .attr("stroke-width", 1.5);

        // max cap
        boxGroup.append("line")
            .attr("x1", cx - capW).attr("x2", cx + capW)
            .attr("y1", y(d.max)).attr("y2", y(d.max))
            .attr("stroke", "#555")
            .attr("stroke-width", 1.5);

        // ── IQR Box (q1 to q3) ────────────────────────────────────────
        boxGroup.append("rect")
            .attr("x", cx - bandwidth / 2)
            .attr("y", y(d.q3))
            .attr("width", bandwidth)
            .attr("height", Math.abs(y(d.q1) - y(d.q3)))
            .attr("fill", "white")
            .attr("stroke", "#333")
            .attr("stroke-width", 1.5);

        // ── Median line ────────────────────────────────────────────────
        boxGroup.append("line")
            .attr("x1", cx - bandwidth / 2).attr("x2", cx + bandwidth / 2)
            .attr("y1", y(d.median)).attr("y2", y(d.median))
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // ── Enacted dot ────────────────────────────────────────────────
        boxGroup.append("circle")
            .attr("cx", cx)
            .attr("cy", y(d.enacted))
            .attr("r", Math.max(3, bandwidth * 0.18))
            .attr("fill", "#10B981")
            .attr("stroke", "white")
            .attr("stroke-width", 1);
    });
}