import { useState, useEffect, useContext } from "react";
import DetailPanel from "./DetailPanel";
import GlobalStoreContext from "../store";
import { getEnsembleSummary } from "../api/api";

export default function EnsembleDetail({expanded, onClick}){

    const { store } = useContext(GlobalStoreContext);
    const selectedState = store?.selectedState || "";
    const [ensembleSummary, setEnsembleSummary] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);  // ensemble options: 'RB' | 'VRA' | null

    useEffect(() => {
        if(!selectedState) return;

        getEnsembleSummary(selectedState)
            .then((res) => {
                console.log("Ensemble summary from server:", res.data);
                setEnsembleSummary(res.data);
            })
            .catch((err) => console.error("Error loading ensemble summary json:", err));

    }, [selectedState]);

    const cards = ensembleSummary ? [
        { label: 'RACE-BLIND', key: "RB", plans: ensembleSummary.raceBlind.plans, threshold: ensembleSummary.raceBlind.threshold },
        { label: 'VRA', key: "VRA",  plans: ensembleSummary.vra.plans, threshold: ensembleSummary.vra.threshold },
    ] : []



    return(
        <DetailPanel title="Ensemble Summary" expanded={expanded} onClick={onClick} >
            <div className={`flex flex-col relative flex-1 px-5 items-center gap-5 overflow-y-auto ${expanded ? 'opacity-100 pt-5' : 'max-h-0 opacity-0'}`}>
                <div className = 'flex gap-2 w-full'>
                    { cards.map(({label, key, plans, threshold})=>(
                        <div
                            key={label}
                            className={`flex flex-col px-3 pt-2 pb-2 flex-1 border-2 rounded-lg cursor-pointer transition-all duration-120
                                ${hoveredCard === key ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200'}`}
                            onMouseEnter={() => setHoveredCard(key)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className = "text-sm text-gray-400">{label}</div>
                            <div className = "flex text-gray-500 text-sm justify-between"> District Plans: <span className = 'font-bold text-emerald-500'>{plans}</span></div>
                            <div className = "flex text-gray-500 text-sm justify-between">Pop. Threshold: <span className = "font-bold text-emerald-500" > ±{threshold ?? '-'}% </span> </div>
                        </div>
                        ))
                    }
                </div>

            </div> 
        </DetailPanel>
    )
}