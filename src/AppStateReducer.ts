import { AppState, POI, Zone } from './AppState'

type Action =
    { type: 'SELECTED_ZONE', zone: Zone } |
    { type: 'SELECTED_POI', poi: POI } |
    { type: 'UNSELECTED_ZONE' } | 
    { type: 'UNSELECTED_POI' } 

export const stateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case "SELECTED_ZONE":
            return {
                ...state,
                selectedZone: action.zone
            };
        case "SELECTED_POI":
            return {
                ...state,
                selectedPOI: action.poi
            };
        
        case "UNSELECTED_ZONE":
            return {
                ...state,
                selectedZone: null
            };

        case "UNSELECTED_POI":
            return {
                ...state,
                selectedPOI: null
            };
    }
};