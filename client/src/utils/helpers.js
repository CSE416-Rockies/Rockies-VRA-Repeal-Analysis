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

export const getRaceLabel = (value) => 
    RACES.find(r => r.value === value)?.label ?? value;

export const toPercent = (value, decimals = 1) => {
    return (value * 100).toFixed(decimals);
}

export function predict(model, params, x) {

    switch(model) {
        case 'sigmoid':
            return (params.L / (1 + Math.exp(-(params.b0 + params.b1 * x))));
        case 'poly2':
            return (params.a * x**2 + params.b * x + params.c);
        case 'power':
            return (params.a * Math.pow(x, params.b));
        case 'exponential':
            return (params.a * Math.exp(params.b * x) + params.c);
        case 'linear':
            return (params.m * x + params.b);
        default:
            return 0;
    }
}