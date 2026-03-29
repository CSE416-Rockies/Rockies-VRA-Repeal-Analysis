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
    { label: "Ensemble", color: "black", shape:  "boxplot"},
    { label: "Enacted", color: "#10B981", shape: "circle"},
]

export const ME_COLORS = {
    raceBlind: "#10B981",
    vra: "#EAB308",
    enacted: "#5D3FD3",
};

export const ENSEMBLE_LEGEND = [
  { label: "Race-Blind", color: "#10B981", shape: "square" },
  { label: "VRA-Constrained", color: "#EAB308", shape: "square" },
];

export const BOX_WHISKER_ME_LEGEND = [
  { label: "Race-Blind", color: "#10B981", shape: "square" },
  { label: "VRA-Constrained", color: "#EAB308", shape: "square" },
  { label: "Enacted", color: "#5D3FD3", shape: "circle" },
];



export const STATE_BOUNDS = {
    Delaware: [
        [38.451, -75.789],
        [39.839, -75.048],
    ],
    Georgia: [
        [30.357, -85.605],
        [35.000, -80.751],
    ],
};