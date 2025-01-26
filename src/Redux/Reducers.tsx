import { actionTypes } from "./Actions";


interface AppState {
    eventsData: any[];
    mobile: string;
    userData: any[],
    otpCode: null,
    otpId: null,
    phoneNumber: null,
    expiresAt: null,
}

interface Action {
    type: string;
    payload?: any;
}

const initialState: AppState = {
    eventsData: [],
    mobile: '',
    userData: [],
    otpCode: null,
    otpId: null,
    phoneNumber: null,
    expiresAt: null,
};

export const reducerFunction = (state = initialState, action: Action): AppState => {
    switch (action.type) {
        case actionTypes.getEventsData:
            return {
                ...state,
                eventsData: action.payload ?? [],
            };

        case actionTypes.getOtpData:
            return {
                ...state,
                otpCode: action.payload.otpCode ?? null,
                otpId: action.payload.otpId ?? null,
                phoneNumber: action.payload.phoneNumber ?? null,
                expiresAt: action.payload.expiresAt ?? null,
            };

        case actionTypes.MobileNumber: {
            return { ...state, mobile: action.payload ?? null };
        }

        case actionTypes.getUserData: {
            return { ...state, userData: action.payload ?? [] };
        }

        default:
            return state;
    }


};
