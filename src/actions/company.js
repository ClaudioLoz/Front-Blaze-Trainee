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
    SET_COMMITTED_CONFIG,
    SET_STRIPE_CUSTOMER,
    SET_STRIPE_CUSTOMER_PAYMENTS,
    SET_COMPANY_LIST,
    SAVE_MEMBER_ATTRIBURTES
} from '../types/company';
import {
    updateCompanyAPI,
    getCompanyAPI,
    deleteMembersAPI,
    deleteVendorsAPI,
    deletePhysiciansAPI,
    getTerminalsAPI,
    updateTerminalAPI,
    addTerminalAPI,
    deleteTerminalAPI,
    getVehiclesAPI,
    fetchVehiclesWithTermAPI,
    getVehicleByIdAPI,
    deleteVehicleAPI,
    saveNewVehicleAPI,
    deleteMemberGroupAPI,
    addMemberGroupAPI,
    updateMemberGroupAPI,
    getMemberGroupsAPI,
    getDeveloperKeysAPI,
    addDeveloperKeysAPI,
    updateDeveloperKeysAPI,
    getAllPermissionsAPI,
    getPermissionsByCompanyAPI,
    updateRoleAPI,
    assignPermissionsAPI,
    saveNewRoleAPI,
    deleteDeveloperKeysAPI,
    getRegionsAPI,
    saveNewRegionAPI,
    deleteRegionAPI,
    updateRegionAPI,
    getCompanyFeaturesAPI,
    getCommittedConfigAPI,
    getStripeCustomerAPI,
    getStripeCustomerPaymentsAPI,
    updateStripeCustomerAddressAPI,
    updateCompanyEmployeeSeatSubscriptionAPI,
    getCompaniesAPI,
    attachCustomerSourceAPI,
    setCustomerDefaultSourceAPI,
    removeCustomerSourceAPI,
    updateSubscriptionDefaultPaymentAPI,
    getMemberAttributesAPI,
    updateMemberAttributesAPI,
    getRegionByIdAPI,
    getKmlByIdAPI,
    getTaxRuleByCompanyAPI,
    regionByTerminalAPI,
    updateVehicleAPI,
    saveCompanyAgreementAPI
} from '../api/company';
import { addMessageCurry, commonActionAPIHit } from '../utils/api';
import { resolve } from 'promise';

export const saveUpdatedCompany = payload => ({
    type: SET_COMPANY,
    payload: payload
})

export const saveTerminals = payload => ({
    type: SET_TERMINALS,
    payload: payload
})

export const saveVehicles = payload => ({
    type: SET_VEHICLES,
    payload: payload
})

export const saveVehicle = payload => ({
    type: SET_VEHICLE,
    payload: payload
})

export const saveMemberGroups = payload => ({
    type: SET_MEMBER_GROUPS,
    payload: payload
})

export const saveDevKeys = payload => ({
    type: SET_DEV_KEYS,
    payload: payload
})

export const setAllPermissions = payload => ({
    type: SET_ALL_PERMISSIONS,
    payload
})

export const setPermissionsByCompany = payload => ({
    type: SET_PERMISSIONS_BY_COMPANY,
    payload
})

export const setRegions = payload => ({
    type: SET_REGIONS,
    payload
})

export const setCompanyFeatures = payload => ({
    type: SET_COMPANY_FEATURES,
    payload
})

export const setCommittedConfig = payload => ({
    type: SET_COMMITTED_CONFIG,
    payload
})

export const setCustomerStripe = payload => ({
    type: SET_STRIPE_CUSTOMER,
    payload
})

export const setStripeCustomerPayments = payload => ({
    type: SET_STRIPE_CUSTOMER_PAYMENTS,
    payload
})

export const setCompanyList = payload => ({
    type: SET_COMPANY_LIST,
    payload
})

export const saveMemberAttributes = payload => ({
    type: SAVE_MEMBER_ATTRIBURTES,
    payload
})

export const updateCompany = company => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                if(company.stripeCustomer) {
                    delete company.stripeCustomer.defaultSourceObject;
                }
                addMessageCurry(updateCompanyAPI(company), dispatch)
                    .then(company => {
                        dispatch(saveUpdatedCompany({ company }));
                        resolve(company);
                    })
            }
        )
    }
}

export const getCompany = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getCompanyAPI(), dispatch)
                    .then(company => {
                        dispatch(saveUpdatedCompany({ company }));
                        resolve(company);
                    })
            }
        )
    }
}

export const deleteMembers = password => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                const data = { password };
                addMessageCurry(deleteMembersAPI(data), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const getTerminals = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getTerminalsAPI(), dispatch)
                    .then(terminals => {
                        dispatch(saveTerminals({ terminals }));
                        resolve(terminals);
                    })
            }
        )
    }
}

export const updateTerminal = terminal => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(updateTerminalAPI(terminal), dispatch)
                    .then(terminal => {
                        resolve(terminal);
                    })
            }
        )
    }
}

export const addNewTerminal = terminal => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(addTerminalAPI(terminal), dispatch)
                    .then(terminal => {
                        resolve(terminal);
                    })
            }
        )
    }
}

//Vehicles
export const getVehicles = () => (dispatch => new Promise(
        (resolve, reject) => {
            addMessageCurry(getVehiclesAPI(), dispatch)
                .then(vehicles => {
                    dispatch(saveVehicles({ vehicles }));
                    resolve(vehicles);
                })
        }
    )
)

export const searchVehicles = (payload = '') => (dispatch => new Promise(
        (resolve, reject) => {
            addMessageCurry(fetchVehiclesWithTermAPI(payload), dispatch)
                .then(vehicles => {
                    dispatch(saveVehicles({ vehicles }));
                    resolve(vehicles);
                })
        }
    )
)
export const getVehicleById = (id) => (dispatch => new Promise(
    (resolve, reject) => {
        addMessageCurry(getVehicleByIdAPI(id), dispatch)
            .then(vehicle => {
                dispatch(saveVehicle({ vehicle }));
                resolve(vehicle);
            })
    }
))

export const updateVehicle = (payload = {}) =>(
    dispatch =>(new Promise((resolve, reject)=>{
        addMessageCurry(updateVehicleAPI(payload), dispatch, '' , "Vehicle Updated Successfully!", true)
            .then(res => {
                resolve(res)
            })
    }))
)

export const addNewVehicle = (payload = {}) =>{
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(saveNewVehicleAPI(payload), dispatch, '' , "Vehicle Created Successfully!", true)
                    .then(res => {
                        resolve(res)
                    })
            }
        )
    }
}

export const deleteVehicle = vehicleId =>{
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(deleteVehicleAPI(vehicleId), dispatch, '' , 'Vehicle Deleted Successfully.', true)
                    .then(res => {
                        resolve(res)
                    })
            }
        )
    }
}
export const deleteVendors = password => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                const data = { password };
                addMessageCurry(deleteVendorsAPI(data), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const deleteTerminal = terminalId => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(deleteTerminalAPI(terminalId), dispatch)
                    .then(terminal => {
                        resolve(terminal);
                    })
            }
        )
    }
}

export const deletePhysicians = password => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                const data = { password };
                addMessageCurry(deletePhysiciansAPI(data), dispatch)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

//Stripe

export const getStripeCustomer = companyId => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getStripeCustomerAPI(companyId), dispatch)
                    .then(res => {
                        dispatch(setCustomerStripe(res))
                        resolve(res);
                    })
            }
        )
    }
}

export const getStripeCustomerPayments = customerId => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getStripeCustomerPaymentsAPI(customerId), dispatch)
                    .then(res => {
                        dispatch(setStripeCustomerPayments(res))
                        resolve(res);
                    })
            }
        )
    }
}

export const updateStripeCustomerAddress = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateStripeCustomerAddressAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}
export const updateCompanyEmployeeSeatSubscription = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateCompanyEmployeeSeatSubscriptionAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}

export const attachCustomerSource = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(attachCustomerSourceAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}

export const setCustomerDefaultSource = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(setCustomerDefaultSourceAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}

export const removeCustomerSource = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(removeCustomerSourceAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}

export const updateSubscriptionDefaultPayment = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateSubscriptionDefaultPaymentAPI(data), dispatch)
                    .then(data => {
                        resolve(data);
                    })
            }
        )
    }
}

// membergroups

export const getMemberGroups = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getMemberGroupsAPI(), dispatch)
                    .then(memberGroups => {
                        dispatch(saveMemberGroups({ memberGroups }));
                        resolve(memberGroups);
                    })
            }
        )
    }
}

export const deleteMemberGroup = commonActionAPIHit(deleteMemberGroupAPI);
export const addNewMemberGroup = commonActionAPIHit(addMemberGroupAPI);
export const updateMemberGroup = commonActionAPIHit(updateMemberGroupAPI);

// dev keys

export const getDevKeys = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getDeveloperKeysAPI(), dispatch)
                    .then(devKeys => {
                        dispatch(saveDevKeys({ devKeys }));
                        resolve(devKeys);
                    })
            }
        )
    }
}

export const addNewDevKey = commonActionAPIHit(addDeveloperKeysAPI);
export const updateDevKey = commonActionAPIHit(updateDeveloperKeysAPI);
export const deleteDevKey = commonActionAPIHit(deleteDeveloperKeysAPI);

export const getAllPermissions = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getAllPermissionsAPI(), dispatch)
                    .then(permissions => {
                        dispatch(setAllPermissions({ permissions }));
                        resolve(permissions);
                    })
            }
        )
    }
}

export const getPermissionsByCompany = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getPermissionsByCompanyAPI(), dispatch)
                    .then(permissionsByCompany => {
                        dispatch(setPermissionsByCompany({ permissionsByCompany }));
                        resolve(permissionsByCompany);
                    })
            }
        )
    }
}

export const assignPermissions = commonActionAPIHit(assignPermissionsAPI);
export const updateRole = commonActionAPIHit(updateRoleAPI);

export const saveNewRole = (data) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(saveNewRoleAPI(data), dispatch)
                    .then(newRole => {
                        dispatch(getPermissionsByCompany());
                        resolve(newRole);
                    })
            }
        )
    }
}

export const getRegions = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getRegionsAPI(), dispatch)
                    .then(regions => {
                        dispatch(setRegions({ regions }));
                        resolve(regions);
                    })
            }
        )
    }
}

export const getRegionsByTerminal = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(regionByTerminalAPI(), dispatch)
                    .then(regions => {
                        dispatch(setRegions({ regions }));
                        resolve(regions);
                    })
            }
        )
    }
}

//ADD tax rule company 
export const getTaxRateByCompany = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getTaxRuleByCompanyAPI(), dispatch)
                    .then(taxRate => {
                        resolve(taxRate);
                    })
            }
        )
    }
}

// ADD RegionByIdApi
export const getRegionById = (id) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getRegionByIdAPI(id), dispatch)
                    .then(region => {
                        resolve(region);
                    })
            }
        )
    }
}


// ADD getKmlByIdAPI
export const getKmlById = (key) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getKmlByIdAPI(key), dispatch)
                    .then(data => {
                        resolve(data);
                    })

            }
        )
    }
}



export const getCompanyFeatures = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getCompanyFeaturesAPI(), dispatch)
                    .then(res => {
                        dispatch(setCompanyFeatures(res))
                        resolve(res)
                    })
            }
        )
    }
}

export const getCommittedConfig = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getCommittedConfigAPI(), dispatch)
                    .then(res => {
                        dispatch(setCommittedConfig(res))
                        resolve(res)
                    })
            }
        )
    }
}

export const saveNewRegion = commonActionAPIHit(saveNewRegionAPI);
export const deleteRegion = commonActionAPIHit(deleteRegionAPI);
export const updateRegion = commonActionAPIHit(updateRegionAPI);

export const getCompanies = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getCompaniesAPI(), dispatch)
                    .then(res => {
                        dispatch(setCompanyList(res))
                        resolve(res)
                    })
            }
        )
    }
}

export const getMemberAttributes = () => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(getMemberAttributesAPI(), dispatch)
                    .then(attributes => {
                        dispatch(saveMemberAttributes({ attributes }));
                        resolve(attributes);
                    })
            }
        )
    }
}

export const updateMemberAttributes = attributes => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateMemberAttributesAPI(attributes), dispatch)
                    .then(attributes => {
                        dispatch(saveMemberAttributes({ attributes }));
                        resolve(attributes);
                    })
            }
        )
    }
}

export const saveCompanyAgreement = (companyId, clickwrapId) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                addMessageCurry(saveCompanyAgreementAPI(companyId, clickwrapId), dispatch)
                    .then(newRole => {
                        resolve(newRole);
                    })
            }
        )
    }
}