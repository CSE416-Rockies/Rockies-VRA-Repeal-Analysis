export const getColor = (feature, minorityGroup) =>{
        if(!minorityGroup) return "#ffffff";
        const group = minorityGroup;
        const key = `${group}_bin`;
        const value = feature.properties[key] || 0;
        return value >= 5 ? "#063E2F" :
               value >= 4 ? "#047857" :
               value >= 3 ? "#10B981" :
               value >= 2 ? "#6EE7B7" :
               value >= 1  ? "#D1FAE5" :
                            "#ECFDF5";
        }



export const lineStyle = () => ({
    fillOpacity: 0,
    weight: 1,
    color: "#6b6b6b",
});

export const highlightStyle = {
    weight: 4,
    fillOpacity: .8,
}

export const choroplethStyle = (feature, minorityGroup) => ({
    fillColor: getColor(feature, minorityGroup),
    fillOpacity: 1,
    color: "#6b6b6b",
    weight: 1,
});
