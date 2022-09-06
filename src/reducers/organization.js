import {
    SET_ORGANIZATION_LIST
} from '../types/organization';

const initState = {
    organizationsList: {},
    lastModified: new Date().getTime()
}

export default (state = initState, action) => {
    switch(action.type) {
        case SET_ORGANIZATION_LIST :
            return {...state, organizationsList: action.payload.organizations, lastModified: new Date().getTime()}
        default:
            return state
    }
}