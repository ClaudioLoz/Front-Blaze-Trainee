import { 
    SAVE_UPDATED_SHOP, 
    SET_SHOP_LIST, 
    SET_SHOP_CONTRACTS, 
    SET_SHOP_FEATURES,
    SET_STORE_KEY,
    SET_PAYMENT_OPTIONS,
    SET_PAYMENT_PROVIDERS,
    SET_PARTNERS,
    SET_NOTIFICATIONS_LIST,
    SAVE_DELIVERY_TAX_RATES,
    SAVE_FEE_LIST,
    SET_PENNY_TOTAL_OPTION
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
            //saveSession({...session, assignedShop: action.payload})

           // console.log(action.payload)

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
        case SET_PARTNERS:
            return {...state, partners: action.payload.partners, lastModified: new Date().getTime()}
        case SET_PAYMENT_PROVIDERS:
            return {...state, paymentProviders: action.payload.paymentProviders, lastModified: new Date().getTime()}
        case SET_NOTIFICATIONS_LIST:
            return {...state, notificationsList: action.payload.notifications, lastModified: new Date().getTime()}
        case SAVE_DELIVERY_TAX_RATES:
            return {...state, deliveryTaxRates: action.payload, lastModified: new Date().getTime()}
        case SAVE_FEE_LIST:
            return {...state, [action.payload.type+'feeList']: action.payload, lastModified: new Date().getTime()}
        default :
            return state
    }
}