import { ChartBarIcon, PresentationChartLineIcon } from '@heroicons/react/24/solid';

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

export const getPrimarySecondaryColors = (racialGroup) => [
    { label: racialGroup, color: "#10B981" },
    { label: `Not ${racialGroup}`, color: "#EAB308" }
]

export const PRESIDENT_CAND_LEGEND = [
    {label: "Harris", value: "democrat", color: PARTY_COLORS.dem},
    {label: "Trump",  value: "republican", color: PARTY_COLORS.rep}
]

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

export const ENSEMBLE_VIEW_OPTIONS = [
  { value: "raceBlind", label: "Race-Blind" },
  { value: "vra", label: "VRA" },
  { value: "both", label: "Both" },
];

export const CHART_VIEWS = [
    { id: 'density', label: 'Density', Icon: PresentationChartLineIcon },
    { id: 'bar',     label: 'Bars',     Icon: ChartBarIcon },
];


/* ----------------------------------------------------- Maps */
export const STATE_OPTIONS = [
    {id: 'Arkansas', label: 'Arkansas'}, 
    {id: 'Georgia',  label: 'Georgia'}
];

export const CHOROPLETH_COLORS = ["#ECFDF5", "#D1FAE5", "#6EE7B7", "#10B981", "#047857", "#063E2F"];

export const VALID_STATES = new Set(STATE_OPTIONS.map(s=>s.id));

export const US_BOUNDS = [
    [24.396308, -124.848974],
    [49.384358, -66.885444]  
]

export const STATE_BOUNDS = {
    Arkansas: [
        [33.0, -94.6],  
        [36.5, -89.6], 
    
    ],
    Georgia: [
        [30.357, -85.605],
        [35.000, -80.751],
    ],
};