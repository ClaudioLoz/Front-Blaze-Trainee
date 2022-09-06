import { apiGet, apiPost, apiDelete, apiPut } from "../utils/api";

//GET APIS 
export const getCompanyAPI = () => {
    return apiGet('mgmt/company')
}

export const getCompaniesAPI = () => {
    return apiGet('mgmt/company/list')
}

export const getCompanyFeaturesAPI= () => {
    return apiGet('mgmt/company/features')
}

export const getCommittedConfigAPI= () => {
    return apiGet('mgmt/settings/committed-config')
}


export const getDeveloperKeysAPI = () =>  {
    return apiGet('mgmt/devkeys')
}

export const getMemberGroupsAPI = () => {
    return apiGet('mgmt/settings/memberGroups')
}

export const getTerminalsAPI = () => {
    return apiGet('mgmt/terminals')
}

export const getVehiclesAPI = () => {
    return apiGet('mgmt/vehicles')
}

export const fetchVehiclesWithTermAPI = (term) => {
    return apiGet(`mgmt/vehicles?term=${term}`);
}

export const getVehicleByIdAPI = (id) => {
    return apiGet(`mgmt/vehicles/${id}`);
}

export const getStripeCustomerAPI  = companyId => {
    return apiGet(`mgmt/company/${companyId}/getCustomer`)
}

export const getStripeCustomerPaymentsAPI  = customerId => {
    return apiGet(`mgmt/company/payments/${customerId}`)
}

export const getMemberAttributesAPI = () => {
    return apiGet(`mgmt/attributes/memberUniqueAttributes`)
}

// Update APIS

export const updateCompanyAPI = company => {
    return apiPost('mgmt/company', company)
}

export const deleteMembersAPI = (data) => {
    return apiPost(`mgmt/reset/delete/members`, data);
}

export const saveNewVehicleAPI = (vehicle) => {
    return apiPost('mgmt/vehicles', vehicle)
}

export const deleteVehicleAPI = (id) => {
    return apiDelete(`mgmt/vehicles/${id}`)
}

export const deleteVendorsAPI = (data) => {
    return apiPost(`mgmt/reset/delete/vendors`, data)
}

export const deletePhysiciansAPI = (data) => {
    return apiPost(`mgmt/reset/delete/physicians`, data)
}

export const updateMemberGroupAPI = memberGroup => {
    return apiPost(`mgmt/settings/memberGroups/${memberGroup.id}`,memberGroup)
}

export const updateVehicleAPI = (vehicle) => {
    return apiPost(`mgmt/vehicles/${vehicle.id}`,vehicle)

}

export const updateTerminalAPI = terminal =>  {
    return apiPost(`mgmt/terminals/${terminal.id}`, terminal)
}

export const updateDeveloperKeysAPI = developerKey =>  {
    return apiPut(`mgmt/devkeys/${developerKey.id}`, developerKey)
}

export const updateStripeCustomerAddressAPI = data => {
    return apiPost('mgmt/company/updateStripeCustomerAddress', data)
}

export const updateCompanyEmployeeSeatSubscriptionAPI = data => {
    return apiPost('mgmt/company/updateCompanyEmployeeSeatSubscription', data)
}

export const attachCustomerSourceAPI = data => {
    return apiPost('mgmt/company/attachCustomerSource', data)
}

export const setCustomerDefaultSourceAPI = data => {
    return apiPost('mgmt/company/setCustomerDefaultSource', data)
}

export const removeCustomerSourceAPI = data => {
    return apiPost('mgmt/company/removeCustomerSource', data)
}

export const updateSubscriptionDefaultPaymentAPI = data => {
    return apiPost('mgmt/company/updateSubscriptionDefaultPayment', data)
}

export const updateMemberAttributesAPI = data => {
    return apiPost ('mgmt/attributes/memberAttributes', data)
}

// Add APIS
export const addMemberGroupAPI = memberGroup => {
    return apiPost(`mgmt/settings/memberGroups/`,memberGroup)
}

export const addTerminalAPI = terminal =>  {
    return apiPost(`mgmt/terminals`, terminal)
}

export const addDeveloperKeysAPI = devKey =>  {
    return apiPost(`mgmt/devkeys`, devKey)
}


//Delete APIS
export const deleteTerminalAPI = terminalId => {
    return apiDelete(`mgmt/terminals/${terminalId}`)
}

export const deleteMemberGroupAPI  = memberGroupId => {
    return apiDelete(`mgmt/settings/memberGroups/${memberGroupId}`)
}

export const getAllPermissionsAPI = () => {
    return apiGet(`mgmt/roles/permissions`);
}

export const getPermissionsByCompanyAPI = () => {
    return apiGet(`mgmt/roles/permissionsByCompany`);
}

export const updateRoleAPI = (data) => {
    return apiPut(`mgmt/roles/${data.id}/updateRole`, data);
}

export const assignPermissionsAPI = (data) => {
    return apiPost('mgmt/roles/assignPermission', data);
}

export const saveNewRoleAPI = (data) => {
    return apiPost('mgmt/roles', data);
}

export const deleteDeveloperKeysAPI  = devKey => {
    return apiDelete(`mgmt/devkeys/${devKey}`)
}

//Regions APIs

export const getRegionsAPI = () => {
    return apiGet(`mgmt/region`);
}

export const saveNewRegionAPI = (data) => {
    return apiPost('mgmt/region', data);
}

export const updateRegionAPI = (region) => {
    return apiPut(`mgmt/region/${region.id}`, region);
}

export const deleteRegionAPI  = regionId => {
    return apiDelete(`mgmt/region/${regionId}`)
}

export const regionByTerminalAPI = () =>{
    return apiGet(`mgmt/region/getListRegionsStore`);
}

// Add RegionsByIdAPI
export const getRegionByIdAPI = (id) => {
    return apiGet(`mgmt/region/${id}`);
}

// Add kml by id
export const getKmlByIdAPI = (key) => {
    return apiGet(`mgmt/assets/${key}`);

}


//Add Taxe Rule by Company
export const getTaxRuleByCompanyAPI = () => {
    return apiGet(`mgmt/deliveryTaxRate/byCompany`);

}

export const saveCompanyAgreementAPI = (companyId, clickwrapId) => {
    return apiPost(`mgmt/docusign/${companyId}/saveCompanyAgreement/${clickwrapId}`, {})
}
