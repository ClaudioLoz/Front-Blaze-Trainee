import { 
    SAVE_UPDATED_SHOP, 
    SET_SHOP_LIST, 
    SET_SHOP_CONTRACTS, 
    SET_SHOP_FEATURES,
    SET_STORE_KEY,
    SET_PAYMENT_OPTIONS
} from '../types/shop';

const initState = {
    shopsList: {},
    contracts: {},
    currentStoreKey: {},
    lastModified: new Date().getTime(),
    paymentOptions: [],
    paymentProviders: [],
    partners: [],
    notificationsList: [],
    deliveryTaxRates: [],
    CashlessAtmfeeList : [],
    shopFeaturesList: []
}

export default (state = initState, action) => {
    switch(action.type) {
        case SAVE_UPDATED_SHOP :
            return {...state, lastModified: new Date().getTime()}
        case SET_SHOP_LIST :
            return {...state, shopsList: action.payload.shopsList, lastModified: new Date().getTime()}
        case SET_SHOP_CONTRACTS :
            return {...state, contracts: action.payload.contracts, lastModified: new Date().getTime()}
        case SET_STORE_KEY :
            return {...state, currentStoreKey: action.payload.currentStoreKey, lastModified: new Date().getTime()}
        case SET_SHOP_FEATURES:
             return { ...state, shopFeaturesList: action.payload.shopFeaturesList.values, lastModified: new Date().getTime() }
        case SET_PAYMENT_OPTIONS:
            return {...state, paymentOptions: action.payload.paymentOptions, lastModified: new Date().getTime()}
        default :
            return state
    }
}