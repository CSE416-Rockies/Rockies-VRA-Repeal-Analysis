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