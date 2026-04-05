import * as d3 from "d3";
import { PARTY_COLORS } from "./constants";
import { drawAxes, drawGrid } from "./drawGridLines";
import { drawBisector } from "./drawBisector";

export function drawScatterPlot({ givenSVG, data, margin, racialLabel }) { 
    
    if (!givenSVG || !data) return;
    var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Dimensions */
    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;
    if (width <= 0 || height <= 0) return;

    /* ------------------------------------------------------------------ Transformation */
    const flatData = data.precincts.flatMap(d => {
        const g = d.groups[racialLabel];
        if (!g) return [];
        return [
            { precinct: d.id, racial_pct: g.pctDemo * 100, vote_share: g.harris * 100, party: "dem" },
            { precinct: d.id, racial_pct: g.pctDemo * 100, vote_share: g.trump * 100, party: "rep" }
        ]
    });

    const fits = data.regression.fits.find(f => f.group === racialLabel);
    if (!fits) return;

    const harrisFit = fits.candidates.find(c => c.candidate === "harris");
    const trumpFit = fits.candidates.find(c => c.candidate === "trump");
    if (!harrisFit || !trumpFit) return;

    const regression = {
        [racialLabel]: {
            dem: { b0: harrisFit.b0, b1: harrisFit.b1 },
            rep: { b0: trumpFit.b0, b1: trumpFit.b1 }
        }
    };


    /* ------------------------------------------------------------------ Axes */
    
    // Create x axis
    var x = d3.scaleLinear()
        .domain([0,100])        // axis ticks
        .range([0,width]);      // graph width 
                
    // Create y axis
    var y = d3.scaleLinear()
        .domain([100,0])        // axis ticks
        .range([0,height]);     // graph height

    const xConfig = d3.axisBottom(x).ticks(4).tickFormat(d => `${d}%`);
    const yConfig = d3.axisLeft(y).ticks(4).tickFormat(d => `${d}%`);

    drawGrid({ svg, width, height, x, xConfig, yConfig });
    drawAxes({
        svg, width, height, margin,
        xConfig: xConfig,
        yConfig: yConfig,
        xLabel: `Percent ${racialLabel}`,
        yLabel: "Vote Shares",
    });
            
    /* ------------------------------------------------------------------ Plot Point Rendering */

    // Scatter dots
    svg.append('g')
        .selectAll("dot")
        .data(flatData)                                     // bind data to dots
        .join("circle")                                 // create circle
            .attr("cx", d => x(d.racial_pct))
            .attr("cy", d => y(d.vote_share) )
            .attr("r", 2)
            .style("fill",  d => PARTY_COLORS[d.party])
            .style("fill-opacity", 0.3)

    /* Draw regression lines from coefficients */
    const raceRegression = regression[racialLabel];
    const lineDataByParty = {};

    ['dem', 'rep'].forEach(party => {
        // sigmoid
        const { b0, b1 } = raceRegression[party];
        // divide x by 100 -> coefficients 0–1 scale to 0 - 100
        const predict = (x) => (1 / (1 + Math.exp(-(b0 + b1 * (x / 100))))) * 100;
        const lineData = d3.range(0, 101, 1).map(x => ({
            x,
            y: Math.min(100, Math.max(0, predict(x)))
        }));

        lineDataByParty[party] = lineData;

        svg.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", PARTY_COLORS[party])
            .attr("stroke-width", 2.5)
            .attr("d", d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveBasis));
    });
    

    drawBisector({
        svg, width, height, x, 
        data: [
            { label: "Harris", values: lineDataByParty.dem  },
            { label: "Trump", values: lineDataByParty.rep  }
        ],
        onHover: ({ xVal, points }) => {
            const harris = points[0].point?.y;
            const trump = points[1].point?.y;
            return `
                <strong>${xVal.toFixed(1)}% ${racialLabel}</strong>
                <div>Harris: ${harris ? harris.toFixed(1) + "%" : "—"}</div>
                <div>Trump: ${trump ? trump.toFixed(1) + "%" : "—"}</div>
            `
        }
    })
}