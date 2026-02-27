import { createContext, useContext, useReducer, useMemo } from "react";

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SELECT_STATE: "SELECT_STATE",
};

function storeReducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case GlobalStoreActionType.SELECT_STATE: {
            return {
                ...state,
                selectedState: payload,
            };
        }
        default:
            return state;
    }
}

export function GlobalStoreContextProvider(props) {
    const [store, dispatch] = useReducer(storeReducer, {
        selectedState: null,
    });

    const storeContextValue = useMemo(() => ({
        store,
        setSelectedState: (stateName) => {
            dispatch({ 
                type: GlobalStoreActionType.SELECT_STATE, 
                payload: stateName 
            });
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