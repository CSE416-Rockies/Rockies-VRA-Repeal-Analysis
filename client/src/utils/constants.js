export function normalizeParty(party) {
    const partyName = party?.toLowerCase();
    if (partyName.includes('rep')) return 'rep';
    if (partyName.includes('dem')) return 'dem';
    return 'other';
}

export const PARTY_COLORS = {
    rep:  "#EF4444",
    dem:  "#3B82F6",
    other: '#6B7280',
}

export const MAP_PARTY_COLORS = {
    rep:  "#E03130",
    dem:  "#4375E0",
    other: '#d8d8d8',
}

export const APP_COLORS = {
    accentGreen: '#10B981'
}

export const PRESIDENT_CAND_LEGEND = [
    {label: "harris", color: PARTY_COLORS.dem},
    {label: "trump", color: PARTY_COLORS.rep}
]
export const getPrimarySecondaryColors = (racialGroup) => [
    {label: racialGroup, color: "#10B981"}, 
    {label: `Not ${racialGroup}`, color: "#D1FAE5"}
]

export const RACES = ["white", "black", "latino", "other"];
export const MINORITIES = ["black","latino", "other"];

export const ENSEMBLES = ["VRA", "Race-Blind"];

export const BOX_WHISKER_LEGEND = [
    { label: "Ensemble", color: "black" },
    { label: "Enacted", color: "#10B981" },
]

export const ENSEMBLE_LEGEND = [
    {label: "race-blind", color: "#10B981"},
    {label: "VRA", color: "#6EE7B7"},
]