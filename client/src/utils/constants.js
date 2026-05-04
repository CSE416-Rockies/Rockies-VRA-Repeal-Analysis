
/* ----------------------------------------------------------------- Label Mapping */

export const PARTY_REFS = {
    dem: { key: 'democrat', label: 'Democratic' },
    rep: { key: 'republican', label: 'Republican' },
}

export const RACES = [
    { value: "white",   label: "White" },
    { value: "black",   label: "Black" },
    { value: "latino",  label: "Latino" },
    { value: "other",   label: "Other" },
];

export const MINORITIES = [
    { value: "black",   label: "Black" },
    { value: "latino",  label: "Latino" },
    { value: "other",   label: "Other" },
];

export const MINORITIES_ENSEMBLES = [
    { value: "black",   label: "Black" },
    { value: "latino",  label: "Latino" },
];

export const ENSEMBLE_VIEW_OPTIONS = [
  { value: "raceBlind", label: "Race-Blind" },
  { value: "vra", label: "VRA" },
  { value: "both", label: "Both" },
];

/* ----------------------------------------------------------------- Colors */
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

export const getCandidateColors = (racialGroup, candView) => [
    { label: racialGroup, color: PARTY_COLORS[candView] },
    { label: `Not ${racialGroup}`, color: candView === 'dem' ? '#BFDBFE' : '#FECACA' },
];

// for EI analysis
export const getCompareColors = () => [
    { label: PARTY_REFS.dem.label, color: PARTY_COLORS.dem },
    { label: PARTY_REFS.rep.label, color: PARTY_COLORS.rep },
];
 
// graph arbitrary duotone
export const getPrimarySecondaryColors = (racialGroup) => [
    { label: racialGroup, color: "#10B981" },
    { label: `Not ${racialGroup}`, color: "#EAB308" }
]

export const ME_COLORS = {
    raceBlind: "#10B981",
    vra: "#EAB308",
    enacted: "#5D3FD3",
};

/* ----------------------------------------------------------------- Legends */

export const BOX_WHISKER_LEGEND = [
    { label: "Ensemble", color: "black", shape:  "boxplot"},
    { label: "Enacted", color: "#10B981", shape: "circle"},
]

export const ENSEMBLE_LEGEND = [
  { label: "Race-Blind", color: "#10B981", shape: "square" },
  { label: "VRA-Constrained", color: "#EAB308", shape: "square" },
];

export const BOX_WHISKER_ME_LEGEND = [
  { label: "Race-Blind", color: "#10B981", shape: "square" },
  { label: "VRA-Constrained", color: "#EAB308", shape: "square" },
  { label: "Enacted", color: "#5D3FD3", shape: "circle" },
];

export const PRESIDENT_CAND_LEGEND = [
    {label: "Harris", value: "dem", color: PARTY_COLORS.dem},
    {label: "Trump",  value: "rep", color: PARTY_COLORS.rep}
]

/* ----------------------------------------------------- Maps */

export const STATE_OPTIONS = [
    {id: 'AR', label: 'Arkansas'}, 
    {id: 'GA',  label: 'Georgia'}
];

export const STATE_CODE = {
    "Arkansas": "AR",
    "Georgia": "GA",
};

export const CHOROPLETH_COLORS = ["#ECFDF5", "#D1FAE5", "#6EE7B7", "#10B981", "#047857", "#063E2F"];

export const VALID_STATES = new Set(STATE_OPTIONS.map(s=>s.id));

export const US_BOUNDS = [
    [24.396308, -124.848974],
    [49.384358, -66.885444]  
]

export const STATE_BOUNDS = {
    AR: [
        [33.0, -94.6],  
        [36.5, -89.6], 
    
    ],
    GA: [
        [30.357, -85.605],
        [35.000, -80.751],
    ],
};