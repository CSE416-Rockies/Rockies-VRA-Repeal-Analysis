import { ME_COLORS } from "./constants";

export function drawEnactedBackground({ svg, x, enactedX, height }) {
    const bandW = x.bandwidth();

    svg.append("rect")
        .attr("x", enactedX)
        .attr("y", 0)
        .attr("width", bandW)
        .attr("height", Math.max(0, height))
        .attr("fill", ME_COLORS["enacted"])
        .attr("opacity", 0.1);
}

export function drawEnactedLabel({ svg, x, enactedX, margin, height }) {
    const bandW = x.bandwidth();
    const midX = enactedX + bandW / 2;
    const arrowW = 6;
    const arrowH = 5;
    const arrowY = -margin.top * 0.5;

    // dotted borders
    svg.append("line")
        .attr("x1", enactedX).attr("x2", enactedX)
        .attr("y1", 0).attr("y2", height)
        .attr("stroke", ME_COLORS["enacted"])
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,3");

    svg.append("line")
        .attr("x1", enactedX + bandW).attr("x2", enactedX + bandW)
        .attr("y1", 0).attr("y2", height)
        .attr("stroke", ME_COLORS["enacted"])
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,3");

    svg.append("polygon")
        .attr("points", [
            [midX,          arrowY + arrowH],
            [midX - arrowW, arrowY],
            [midX + arrowW, arrowY],
        ].map(p => p.join(",")).join(" "))
        .attr("fill", ME_COLORS["enacted"]);

    svg.append("text")
        .attr("x", midX)
        .attr("y", arrowY - 4)
        .attr("text-anchor", "middle")
        .attr("fill", ME_COLORS["enacted"])
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .text("Enacted");
}