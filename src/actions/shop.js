import {
    SAVE_UPDATED_SHOP,
    SET_SHOP_LIST,
    SET_SHOP_FEATURES,
    SET_SHOP_CONTRACTS,
    SET_STORE_KEY,
    SET_PAYMENT_OPTIONS,
    SET_PAYMENT_PROVIDERS,
    SET_PARTNERS,
    SET_NOTIFICATIONS_LIST,
    SAVE_DELIVERY_TAX_RATES,
    SAVE_FEE_LIST,
} from '../types/shop';
import {
    generateKeyAPI,
    updateShopAPI,
    updateShopFeatureAPI,
    deleteProductsAPI,
    deleteProductStockAPI,
    getShopFeaturesAPI,
    getShopListAPI,
    getShopUtilsAPI,
    addShopAPI,
    getShopTerminalsAPI,
    getContractsAPI,
    updateShopContractAPI,
    addShopContractAPI,
    getCurrentStoreKeyAPI,
    getPaymentOptionsAPI,
    savePaymentOptionsAPI,
    getPaymentProvidersAPI,
    savePaymentProvidersAPI,
    getPartnersAPI,
    getNotificationsListAPI,
    updateNotificationAPI,
    updateSpecificShopDataAPI,
    updateNotificationListAPI,
    getDeliveryTaxRateAPI,
    postDeliveryTaxRateAPI,
    updateDeliveryTaxRateAPI,
    deleteDeliveryTaxRateAPI,
    getShopTaxesDisplayNamesAPI,
    updateShopTaxesDisplayNamesAPI,
    getFeeListAPI,
    addUpdateFeeAPI,
    getTerminalsByShopsAPI,
    updateAssignedShopIdListAPI,
    getShopLabelsAPI,
    getLabelImageAPI,
    getLabelThumbnailAPI,
    getLabelTemplatesAPI,
    getLabelTemplateByIdAPI,
    getIsLabelMakerEnabled
} from '../api/shop';
import { addMessageCurry, commonActionAPIHit, getSession } from '../utils/api';
import { saveTerminals } from './company';
import { actionCreatorUtil } from '../utils/common';

export const saveUpdatedShop = payload => ({
    type: SAVE_UPDATED_SHOP,
    payload
})

export const setShopList = payload => ({
    type: SET_SHOP_LIST,
    payload
})

export const setShopFeatures = payload => ({
    type: SET_SHOP_FEATURES,
    payload
})

export const saveContracts = payload => ({
    type: SET_SHOP_CONTRACTS,
    payload
})

export const setPaymentOptions = payload => ({
    type: SET_PAYMENT_OPTIONS,
    payload
})

export const setPaymentProviders = payload => ({
    type: SET_PAYMENT_PROVIDERS,
    payload
})

export const setPartners = payload => ({
    type: SET_PARTNERS,
    payload
})

export const setNotificationsList = payload => ({
    type: SET_NOTIFICATIONS_LIST,
    payload
})

export const saveDeliveryTaxRates = payload => ({
    type: SAVE_DELIVERY_TAX_RATES,
    payload
})

export const save = payload => ({
    type: SAVE_DELIVERY_TAX_RATES,
    payload
})

export const saveFeeList = payload => ({
    type: SAVE_FEE_LIST,
    payload
})

export const setStoreKey = actionCreatorUtil(SET_STORE_KEY)

export const getShopList = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getShopListAPI(), dispatch)
                    .then(shopsList => {
                        dispatch(setShopList({ shopsList }))
                        resolve(shopsList)
                    })
                    .catch(
                        err => console.log(err)
                    )

            }
        )
    }
}

export const getShopFeatures = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getShopFeaturesAPI(), dispatch)
                    .then(shopFeaturesList => {
                        dispatch(setShopFeatures({ shopFeaturesList }))
                        resolve(shopFeaturesList)
                    })
                    .catch(
                        err => console.log(err)
                    )

            }
        )
    }
}

export const addShop = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(addShopAPI(data), dispatch)
                    .then(shop => {
                        resolve(shop);
                    })
            }
        )
    }
}

export const updateShop = shop => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(updateShopAPI(shop), dispatch)
                    .then(shop => {

                        const session = getSession();
                        const { assignedShop } = session;

                        if (assignedShop.id === shop.id) {
                            dispatch(saveUpdatedShop({ shop, session: { ...session, assignedShop: shop } }));
                        }

                        resolve(shop);
                    })
            }
        )
    }
}

export const updateShopFeatures = shopFeatures => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateShopFeatureAPI(shopFeatures), dispatch)
                    .then(shopFeatures => {
                        resolve(shopFeatures);
                    })
            }
        )
    }
}

export const resetProductStock = password => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                const data = { password };
                addMessageCurry(deleteProductStockAPI(data), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const resetProducts = password => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                const data = { password };
                addMessageCurry(deleteProductsAPI(data), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const getShopTerminals = shopId => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getShopTerminalsAPI(shopId), dispatch)
                    .then(terminals => {
                        dispatch(saveTerminals({ terminals }));
                        resolve(terminals);
                    })
            }
        )
    }
}

export const getTerminalsByShops = shopIds => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getTerminalsByShopsAPI(shopIds), dispatch)
                    .then(terminals => {
                        resolve(terminals && terminals.values || []);
                    })
            }
        )
    }
} 

export const getContracts = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getContractsAPI(), dispatch)
                    .then(contracts => {
                        dispatch(saveContracts({ contracts }));
                        resolve(contracts);
                    })
            }
        )
    }
}

export const addShopContract = commonActionAPIHit(addShopContractAPI);
export const updateShopContract = commonActionAPIHit(updateShopContractAPI)

export const getStoreKey = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getCurrentStoreKeyAPI(), dispatch)
                    .then(currentStoreKey => {
                        dispatch(setStoreKey({ currentStoreKey }));
                        resolve(currentStoreKey);
                    })
            }
        )
    }
}

export const generateKey = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(generateKeyAPI(), dispatch)
                    .then(currentStoreKey => {
                        dispatch(setStoreKey({ currentStoreKey }));
                        resolve(currentStoreKey);
                    })
            }
        )
    }
}

export const getPaymentOptions = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getPaymentOptionsAPI(), dispatch)
                    .then(paymentOptions => {
                        dispatch(setPaymentOptions({ paymentOptions: paymentOptions.values }));
                        resolve(paymentOptions.values);
                    })
            }
        )
    }
}

export const savePaymentOptions = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(savePaymentOptionsAPI(data), dispatch)
                    .then(() => {
                        dispatch(getPaymentOptions());
                        resolve();
                    })
            }
        )
    }
}

export const getPaymentProviders = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getPaymentProvidersAPI(), dispatch)
                    .then(paymentProviders => {
                        dispatch(setPaymentProviders({ paymentProviders: paymentProviders.values }));
                        resolve(paymentProviders.values);
                    })
            }
        )
    }
}

export const savePaymentProviders = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(savePaymentProvidersAPI(data), dispatch)
                    .then(() => {
                        dispatch(getPaymentProviders());
                        resolve();
                    })
            }
        )
    }
}


export const getPartners = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getPartnersAPI(), dispatch)
                    .then(partners => {
                        dispatch(setPartners({ partners: partners.values }));
                        resolve(partners.values);
                    })
            }
        )
    }
}

export const getNotificationsList = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getNotificationsListAPI(data), dispatch)
                    .then((notifications) => {
                        dispatch(setNotificationsList({ notifications }));
                        resolve(notifications);
                    })
            }
        )
    }
}

export const updateNotification = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateNotificationAPI(data), dispatch)
                    .then((notifications) => {
                        return (notifications)
                    })
            }
        )
    }
}

export const updateNotificationsList = (notifications) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateNotificationListAPI(notifications), dispatch)
                    .then((notifications) => {
                        dispatch(setNotificationsList({ notifications }))
                        return (notifications)
                    })
            }
        )
    }
}

export const updateSpecificShopData = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateSpecificShopDataAPI(data)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
                )

            }
        )
    }
}

export const getDeliveryTaxRate = (shopId) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getDeliveryTaxRateAPI(shopId), dispatch)
                    .then(res => {
                        dispatch(saveDeliveryTaxRates(res));
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
        )
    }
}

export const postDeliveryTaxRate = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(postDeliveryTaxRateAPI(data), dispatch)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))


            }
        )
    }
}

export const updateDeliveryTaxRate = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateDeliveryTaxRateAPI(data), dispatch)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
        )
    }
}

export const deleteDeliveryTaxRate = (id) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(deleteDeliveryTaxRateAPI(id), dispatch)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
        )
    }
}


export const getTaxesDisplayNames = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getShopTaxesDisplayNamesAPI(), dispatch)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
        )
    }
}



export const updateTaxesDisplayNames = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateShopTaxesDisplayNamesAPI(data), dispatch)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
        )
    }
}

export const getFeeList = feeType => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getFeeListAPI(feeType), dispatch)
                    .then(fee => {
                        dispatch(saveFeeList({ type : feeType, fee }));
                        resolve(fee);
                    })
            }
        )
    }
}

export const addUpdateFee = (feeType,data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(addUpdateFeeAPI(feeType,data), dispatch)
                    .then(fee => {
                        resolve(fee);
                    })
            }
        )
    }
}

export const getShopLabels = (shopId) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getShopLabelsAPI(shopId), dispatch)
                    .then(labels => {
                        resolve(labels);
                    })
                }
        )
    
    }
}

export const getShopUtils = (shopId) => {
    return dispatch => {
        return new Promise (
            (resolve, reject) => {
                addMessageCurry(getShopUtilsAPI(shopId), dispatch)
                    .then(shop => {
                        resolve(shop);
                    })
            }
        )
    }
}

export const getLabelImage = (templateId) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getLabelImageAPI(templateId), dispatch)
                    .then(labelImage => {
                        resolve(labelImage);
                    })
            }
        )
    }
}

export const getLabelThumbnail = (templateId) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getLabelThumbnailAPI(templateId), dispatch)
                    .then(labelImage => {
                        resolve(labelImage);
                    })
            }
        )
    }
}

export const getLabelTemplates = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getLabelTemplatesAPI(data), dispatch)
                    .then(templates => {
                        resolve(templates);
                    })
            }
        )
    }
}

export const getLabelTemplateById = (id) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getLabelTemplateByIdAPI(id), dispatch)
                    .then(template => {
                        resolve(template);
                    })
            }
        )
    }
}

export const updateAssignedShopIdList = (id, assignedShopIds) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateAssignedShopIdListAPI(id, assignedShopIds), dispatch)
                    .then(template => {
                        resolve(template);
                    })
            }
        )
    }
}

export const isLabelMakerEnabled = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getIsLabelMakerEnabled(), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}