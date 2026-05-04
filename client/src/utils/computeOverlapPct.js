import { toPercent } from "./helpers";

export function computeOverlapPct(curveA, curveB) {
    console.log(curveA);
    console.log(curveB);
    const xs = Array.from(new Set([...curveA.map(d => d.x), ...curveB.map(d => d.x)])).sort((a, b) => a - b);

    // estimate the y value on the curve given x 
    const interp = (curve, xTarget) => {
        if (xTarget <= curve[0].x) return curve[0].y;
        if (xTarget >= curve.at(-1).x) return curve.at(-1).y;
        const i = curve.findIndex(p => p.x > xTarget) - 1;
        const t = (xTarget - curve[i].x) / (curve[i + 1].x - curve[i].x);
        return curve[i].y + t * (curve[i + 1].y - curve[i].y);
    };

    // trapezoidal integration
    let overlap = 0;
    for (let i = 0; i < xs.length - 1; i++) {
        const dx = xs[i + 1] - xs[i];
        overlap += 0.5 * dx * (Math.min(interp(curveA, xs[i]), interp(curveB, xs[i])) +
                               Math.min(interp(curveA, xs[i + 1]), interp(curveB, xs[i + 1])));
    }

    return +toPercent(overlap);
}