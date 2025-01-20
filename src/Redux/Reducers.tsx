import { actionTypes } from './actions';

interface AppState {
    eventsData: any[];
}

interface Action {
    type: string;
    payload?: any;
}

const initialState: AppState = {
    eventsData: [],
};

export const reducerFunction = (state = initialState, action: Action): AppState => {
    switch (action.type) {
        case actionTypes.getEventsData:
            return {
                ...state,
                eventsData: action.payload ?? [],
            };


        default:
            return state;
    }
};
