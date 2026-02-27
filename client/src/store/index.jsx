import { createContext, useContext, useReducer, useMemo } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SELECT_STATE: "SELECT_STATE",
    SET_MAP_MODE: "SET_MAP_MODE",
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
        default:
            return store;
    }
}

export function GlobalStoreContextProvider(props) {
    const [store, dispatch] = useReducer(storeReducer, {
        selectedState: null,
        mapMode: 'district',
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
    }), [store]);

    return (
        <GlobalStoreContext.Provider value={storeContextValue}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export const useGlobalStore = () => useContext(GlobalStoreContext);