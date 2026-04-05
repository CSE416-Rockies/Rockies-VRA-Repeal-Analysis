import * as d3 from "d3";
import { drawAxes, drawGrid } from "./drawGridLines";
import { drawBox} from "./drawBox";
import { ME_COLORS } from "./constants";

export function drawBoxWhiskerME({givenSVG, data, margin, racialGroup}){
    if(!givenSVG) return;

    var svg = d3.select(givenSVG)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    /* ------------------------------------------------------------------ Flatten map */
    const groups = Object.entries(data.groups).map(([race, values]) => ({
        race,
        raceBlind: values.raceBlind,
        vra: values.vra,
        enactedCount: values.enactedCount
    }));

    const ensembleTypes = ["raceBlind", "vra"];

    /* ------------------------------------------------------------------ Dimensions */
    const width = givenSVG.clientWidth - margin.left - margin.right;
    const height = givenSVG.clientHeight - margin.top - margin.bottom;


    /* ------------------------------------------------------------------ Axes */

    // outer X scale for racial groups
    var xOuter = d3.scaleBand()
        .domain(groups.map(d => d.race))
        .range([0, width])
        .padding(0.1);

    // inner X scale for vra vs raceBlind
    var xInner = d3.scaleBand()
        .domain(ensembleTypes)
        .range([0, xOuter.bandwidth()])
        .padding(0.5);

    // Create y axis
    const allVals = groups.flatMap(g => [g.raceBlind.max, g.vra.max, g.enactedCount ]);
    const yMax = d3.max(allVals)

    const y = d3.scaleLinear()
        .domain([yMax, 0])
        .range([0, height]);

    const xConfig = d3.axisBottom(xOuter);
    const yConfig = d3.axisLeft(y).ticks(6);

    drawGrid({svg, width, height, xOuter, xConfig, yConfig, hideX: true});
    drawAxes({
        svg, width, height, margin, xConfig, yConfig,
        xLabel: "Racial Group",
        yLabel: "# of Effective Districts",
        small: true,
    });

    /* ------------------------------------------------------------------ Boxes */
    
    groups.forEach((g,i) => {
        const groupX = xOuter(g.race);
        const isHighlighted = (g.race === racialGroup);

        // boxes
        ensembleTypes.forEach(type => {
            const stats = g[type];
            const cx = groupX + xInner(type) + xInner.bandwidth() / 2;  
            const bandwidth = xInner.bandwidth();
            
            console.log(type);
            drawBox(svg, { cx, bandwidth, y, d: stats, isHighlighted, color: ME_COLORS[type] });          
        });
        
        // circle
        svg.append("circle")
            .attr("cx", groupX + xOuter.bandwidth() / 2)
            .attr("cy", y(g.enactedCount))
            .attr("r", 6)
            .attr("fill", ME_COLORS["enacted"])
            .attr("stroke", "white")
            .attr("stroke-width", 1.5);

        // dashed line
        if (i < groups.length - 1) {
            const lineX = groupX + xOuter.bandwidth() + (xOuter.step() * xOuter.paddingInner()) / 2;
            svg.append("line")
                .attr("x1", lineX)
                .attr("x2", lineX)
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "#D1D5DB")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4,4"); 
        }
    });
}