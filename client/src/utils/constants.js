export const PARTY_COLORS = {
    rep: "#CC0000",
    dem: "#0064CE"
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