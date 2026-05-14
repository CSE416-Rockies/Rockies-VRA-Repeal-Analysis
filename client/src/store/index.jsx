import { createContext, useContext, useReducer, useMemo } from "react";
import { STATE_CODE, FEASIBLE_MINORITIES, FEASIBLE_RACES } from "../utils/constants";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SELECT_STATE: "SELECT_STATE",
    SET_MAP_MODE: "SET_MAP_MODE",
    SET_MINORITY_GROUP: "SET_MINORITY_GROUP",
    SET_RACIAL_GROUP: "SET_RACIAL_GROUP",
    SET_ENSEMBLE: "SET_ENSEMBLE",
    SET_BOXWHISKER: "SET_BOXWHISKER",
    SET_REPRESENTATIVES: "SET_REPRESENTATIVES",
};

function storeReducer(store, action) {
    const { type, payload } = action;
    switch (type) {
        case GlobalStoreActionType.SELECT_STATE: {

            const newState = payload;
            const availableGroups = FEASIBLE_MINORITIES[newState] ?? [];
            const availableRaces = FEASIBLE_RACES[newState] ?? [];
            
            return {
                ...store,
                selectedState: payload,
                minorityGroup: availableGroups.some(r => r.value === store.minorityGroup) ? store.minorityGroup : null,
                racialGroup: availableRaces.some(r => r.value === store.racialGroup) ? store.racialGroup : null,
            };
        }
        case GlobalStoreActionType.SET_MAP_MODE: {
            return {
                ...store,
                mapMode: payload,
            }
        }
        case GlobalStoreActionType.SET_MINORITY_GROUP: {
            return {
                ...store,
                minorityGroup: payload,
            }
        }
        case GlobalStoreActionType.SET_RACIAL_GROUP: {
            return {
                ...store,
                racialGroup: payload,
            }
        }
        case GlobalStoreActionType.SET_ENSEMBLE: {
            return {
                ...store,
                ensemble: payload,
            }
        }
        case GlobalStoreActionType.SET_BOXWHISKER: {
            return {
                ...store,
                boxWhisker: payload,
            }
        }
        case GlobalStoreActionType.SET_REPRESENTATIVES: {
            return {
                ...store,
                representatives: payload,
            }
        }
 
        


        default:
            return store;
    }
}

export function GlobalStoreContextProvider(props) {
    const [store, dispatch] = useReducer(storeReducer, {
        selectedState: null,
        mapMode: 'district',
        minorityGroup: null,
        racialGroup: null,
        ensemble: 'raceBlind',
        boxWhisker: null,
        representatives: [],
    });

    const storeContextValue = useMemo(() => ({
        store,
        setSelectedState: (stateName) => {
            dispatch({ 
                type: GlobalStoreActionType.SELECT_STATE, 
                payload: STATE_CODE[stateName] ?? stateName
            });
        },
        setMapMode: (mapMode) => {
            dispatch({
                type: GlobalStoreActionType.SET_MAP_MODE,
                payload: mapMode
            })
        },
        setMinorityGroup: (minorityGroup) => {
            dispatch({
                type: GlobalStoreActionType.SET_MINORITY_GROUP,
                payload: minorityGroup
            })
        },
        setRacialGroup: (racialGroup) =>{
            dispatch({
                type: GlobalStoreActionType.SET_RACIAL_GROUP,
                payload: racialGroup
            })
        },
        setEnsemble: (ensemble) =>{
            dispatch({
                type: GlobalStoreActionType.SET_ENSEMBLE,
                payload: ensemble
            })
        },
        setBoxWhisker: (boxWhisker) => {
            dispatch({
                type: GlobalStoreActionType.SET_BOXWHISKER,
                payload: boxWhisker
            })
        },
        setRepresentatives: (representatives) =>{
            dispatch({
                type: GlobalStoreActionType.SET_REPRESENTATIVES,
                payload: representatives
            })
        }
    }), [store]);

    return (
        <GlobalStoreContext.Provider value={storeContextValue}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export const useGlobalStore = () => useContext(GlobalStoreContext);