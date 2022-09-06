import {
    SET_COMPANY,
    SET_TERMINALS,
    SET_VEHICLES,
    SET_VEHICLE,
    SET_MEMBER_GROUPS,
    SET_DEV_KEYS,
    SET_ALL_PERMISSIONS,
    SET_PERMISSIONS_BY_COMPANY,
    SET_REGIONS,
    SET_COMPANY_FEATURES,
    SET_STRIPE_CUSTOMER,
    SET_STRIPE_CUSTOMER_PAYMENTS,
    SET_COMPANY_LIST,
    SAVE_MEMBER_ATTRIBURTES,
    SET_COMMITTED_CONFIG
} from '../types/company';

const initState = {
    company: {},
    terminals: {},
    vehicles: {},
    memberGroups: {},
    devKeys: {},
    lastModified: new Date().getTime(),
    companyPermissions: [],
    permissions: [],
    regions: {},
    companyFeatures: {},
    companyList: {},
    memberAttribuites: [],
}

export default (state = initState, action) => {
    switch(action.type) {
        case SET_COMPANY :
            return {...state, company: action.payload.company, lastModified: new Date().getTime()}
        case SET_TERMINALS :
            return {...state, terminals: action.payload.terminals, lastModified: new Date().getTime()}
        case SET_VEHICLES :
            return {...state, vehicles: action.payload.vehicles, lastModified: new Date().getTime()}
        case SET_VEHICLE:
            return {...state, vehicle: action.payload.vehicle, lastModified: new Date().getTime()}
        case SET_MEMBER_GROUPS :
            return {...state, memberGroups: action.payload.memberGroups, lastModified: new Date().getTime()}
        case SET_DEV_KEYS :
            return {...state, devKeys: action.payload.devKeys, lastModified: new Date().getTime()}
        case SET_ALL_PERMISSIONS:
            return { ...state, permissions: action.payload.permissions }
        case SET_PERMISSIONS_BY_COMPANY:
            return { ...state, companyPermissions: action.payload.permissionsByCompany }
        case SET_REGIONS:
            return { ...state, regions: action.payload.regions, lastModified: new Date().getTime() }
        case SET_COMPANY_FEATURES:
            return { ...state, companyFeatures: action.payload }
        case SET_COMMITTED_CONFIG:
            return { ...state, committedConfig: action.payload }
        case SET_STRIPE_CUSTOMER:
            return {...state, stripeCompany: action.payload }
        case SET_STRIPE_CUSTOMER_PAYMENTS:
            return {...state, stripeCustomerPayments: action.payload }
        case SET_COMPANY_LIST:
            return { ...state, companyList: action.payload}
        case SAVE_MEMBER_ATTRIBURTES:
            return {...state, memberAttribuites: action.payload}
        default :
            return state
    }
}