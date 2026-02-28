import { createContext, useContext, useReducer, useMemo } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SELECT_STATE: "SELECT_STATE",
    SET_MAP_MODE: "SET_MAP_MODE",
    SET_MINORITY_GROUP: "SET_MINORITY_GROUP"
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

        default:
            return store;
    }
}

export function GlobalStoreContextProvider(props) {
    const [store, dispatch] = useReducer(storeReducer, {
        selectedState: null,
        mapMode: 'district',
        minorityGroup: null,
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