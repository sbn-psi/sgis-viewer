import { AppState, Zone } from './AppState'

type Action =
    { type: 'SELECTED_ZONE', zone: Zone }

export const stateReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case "SELECTED_ZONE":
            return {
                ...state,
                selectedZone: action.zone
            };
    }
};