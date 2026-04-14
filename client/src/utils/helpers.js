import { RACES } from "./constants";

export function normalizeParty(party) {
    const partyName = party?.toLowerCase();
    if (partyName.includes('rep')) return 'rep';
    if (partyName.includes('dem')) return 'dem';
    return 'other';
}

export function normalizeDistrict(district) {
    return String(district.replace(/\D/g, ""));
}

export const capitalize = (str) => str.replace(/\b\w/g, c => c.toUpperCase());


export const getRaceLabel = (value) => 
    RACES.find(r => r.value === value)?.label ?? value;

export const toPercent = (value, decimals = 1) => {
    return (value * 100).toFixed(decimals);
}

export function predict(model, params, x) {

    switch(model) {
        case 'sigmoid':
            if (params.L == null || params.b0 == null || params.b1 == null) { console.error("sigmoid missing params", params); return 0; }
            return (params.L / (1 + Math.exp(-(params.b0 + params.b1 * x))));

        case 'poly2':
            if (params.a == null || params.b == null || params.c == null) { console.error("poly2 missing params", params); return 0; }
            return (params.a * x**2 + params.b * x + params.c);

        case 'power':
            if (params.a == null || params.b == null) { console.error("power missing params", params); return 0; }
            return (params.a * Math.pow(x, params.b));

        case 'exponential':
            if (params.a == null || params.b == null || params.c == null) { console.error("exponential missing params", params); return 0; }
            return (params.a * Math.exp(params.b * x) + params.c);

        case 'linear':
            if (params.m == null || params.b == null) { console.error("linear missing params", params); return 0; }
            return (params.m * x + params.b);

        default:
            return 0;
    }
}