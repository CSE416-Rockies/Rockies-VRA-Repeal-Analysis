import * as d3 from "d3";
import { bindTooltip } from "./tooltip";

export function drawBox(boxGroup, {cx, bandwidth, y, d, color, tooltipHTML}){

    // ── Whisker line (min to max) ──────────────────────────────────
    boxGroup.append("line")
        .attr("x1", cx).attr("x2", cx)
        .attr("y1", y(d.min)).attr("y2", y(d.max))
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 1.5);

    // ── Whisker caps ───────────────────────────────────────────────
    const capW = bandwidth * 0.4;

    // min cap
    boxGroup.append("line")
        .attr("x1", cx - capW).attr("x2", cx + capW)
        .attr("y1", y(d.min)).attr("y2", y(d.min))
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 1.5);

    // max cap
    boxGroup.append("line")
        .attr("x1", cx - capW).attr("x2", cx + capW)
        .attr("y1", y(d.max)).attr("y2", y(d.max))
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 1.5);

    // ── IQR Box (q1 to q3) ────────────────────────────────────────
    boxGroup.append("rect")
        .attr("x", cx - bandwidth / 2)
        .attr("y", y(d.q3))
        .attr("width", bandwidth)
        .attr("height", Math.abs(y(d.q1) - y(d.q3)))
        .attr("fill", color)
        .attr("fill-opacity", 0.5)
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 1.5);

    // ── Median line ────────────────────────────────────────────────
    boxGroup.append("line")
        .attr("x1", cx - bandwidth / 2).attr("x2", cx + bandwidth / 2)
        .attr("y1", y(d.median)).attr("y2", y(d.median))
        .attr("stroke", d3.color(color).darker(1))
        .attr("stroke-width", 2);


    // ── Tooltip overlay ───────────────────────────────────────────
    const bw = boxGroup.append("rect")
        .attr("x", cx - bandwidth / 2)
        .attr("y", y(d.max))
        .attr("width", bandwidth)
        .attr("height", Math.abs(y(d.min) - y(d.max)))
        .attr("fill", "transparent")
        .datum(d);
    
    bindTooltip(bw, tooltipHTML);
}
