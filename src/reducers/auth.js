import { AUTH_SUCCESS,SAVE_DOCUSIGN_INFO } from '../types/auth';
import { SAVE_UPDATED_SHOP } from '../types/shop';
import { saveSession, getSession, saveDocuSign } from '../utils/api';

const session = getSession();

const initState = {
    session,
    showSessionTimeoutModal: false,
    timerId: null
}

export default (state = initState, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
            saveSession(action.payload.session)
            return { ...state, session: action.payload.session }
        case SAVE_UPDATED_SHOP:
            saveSession(action.payload.session)
            return { ...state, session: { ...state.session, ...action.payload.session, assignedShop: action.payload.shop } }
        case SAVE_DOCUSIGN_INFO:
            saveDocuSign(action.payload)
            return { ...state, docuSign: action.payload }
        default:
            return state
    }
}