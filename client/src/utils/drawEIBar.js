import * as d3 from "d3";
import { getPrimarySecondaryColors } from "./constants";
import { drawAxes, drawGrid } from "./drawGridLines";
import { drawBars } from "./drawBars";
import { capitalize } from "./helpers";

export function drawEIBar({ givenSVG, data, margin, racialLabel, candView }) {
    const candData = data.candidates[candView];
    if (!candData) return;

    const groupData = candData.groups[racialLabel];
    if (!groupData) return;

    const peakX = (density) => density.reduce((a, b) => b.y > a.y ? b : a).x;

    const svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;

    const colors = getPrimarySecondaryColors(racialLabel);
    const primaryColor = colors[0].color;
    const secondaryColor = colors[1].color;

    const bars = [
        {
            label: racialLabel,
            color: primaryColor,
            peak: peakX(groupData.density.group),
            ci: groupData.credible_interval_95.group,
            mean: groupData.posterior_mean.group,
        },
        {
            label: `Not ${racialLabel}`,
            color: secondaryColor,
            peak: peakX(groupData.density.complement),
            ci: groupData.credible_interval_95.complement,
            mean: groupData.posterior_mean.complement,
        }
    ];


    /* ------------------------------------------------------------------ Axis Rendering */
    const x = d3.scaleBand()
        .domain(bars.map(b => b.label))
        .range([0, width])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    const xConfig =  d3.axisBottom(x).tickFormat(d => capitalize(String(d)));
    const yConfig = d3.axisLeft(y).ticks(4);


    drawGrid({ svg, width, height, xConfig, yConfig, hideX: true });
    drawAxes({
        svg, width, height, margin,
        xLabel: "Group",
        yLabel: "Peak Probability",
        xConfig, yConfig,
    });

    /* ------------------------------------------------------------------ Plot Point Rendering */
    
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div").attr("class", "tooltip");
    }

    const drawWhisker = (x1, x2, y1, y2) => {
        svg.append("line")
            .attr("x1", x1).attr("x2", x2)
            .attr("y1", y1).attr("y2", y2)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
    };

    bars.forEach(bar => {
        drawBars({
            svg, x, y, height,
            entries: [{ x: bar.label, y: bar.peak }],
            color: bar.color,
            tooltipHTML: () => `
                <strong style="text-transform:capitalize">${bar.label}</strong>
                <div>Peak: ${bar.peak.toFixed(3)}</div>
                <div>95% CI: [${bar.ci[0].toFixed(2)}, ${bar.ci[1].toFixed(2)}]</div>
            `,
        });


        
        // CI whiskers 
        const ciX = x(bar.label) + x.bandwidth() / 2;
        const capWidth = x.bandwidth() * 0.25;

        drawWhisker(ciX, ciX, y(bar.ci[1]), y(bar.ci[0]));
        drawWhisker(ciX - capWidth, ciX + capWidth, y(bar.ci[1]), y(bar.ci[1]));
        drawWhisker(ciX - capWidth, ciX + capWidth, y(bar.ci[0]), y(bar.ci[0]));
    });
}