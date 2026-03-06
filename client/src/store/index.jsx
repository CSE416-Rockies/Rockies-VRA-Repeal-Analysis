import { createContext, useContext, useReducer, useMemo } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SELECT_STATE: "SELECT_STATE",
    SET_MAP_MODE: "SET_MAP_MODE",
    SET_MINORITY_GROUP: "SET_MINORITY_GROUP",
    SET_RACIAL_GROUP: "SET_RACIAL_GROUP",
    SET_ENSEMBLE: "SET_ENSEMBLE",
};

function storeReducer(store, action) {
    const { type, payload } = action;
    switch (type) {
        case GlobalStoreActionType.SELECT_STATE: {
            return {
                ...store,
                selectedState: payload,
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
        ensemble: null,
    });

    const storeContextValue = useMemo(() => ({
        store,
        setSelectedState: (stateName) => {
            dispatch({ 
                type: GlobalStoreActionType.SELECT_STATE, 
                payload: stateName 
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