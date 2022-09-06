import { apiPost, apiGet } from "../utils/api";

export const loginAPI = data => {

    return apiPost('mgmt/session', data)

}

export const switchAppAPI = data => {

    return apiGet('mgmt/session/switch-app', data);

}

export const getCurrentSessionAPI = (headers) => {

    return apiGet('mgmt/session', {}, headers);

}

export const changeShopAPI = data => {

    return apiPost('mgmt/session/shop', data);

}

export const resetPasswordAPI = data => {

    return apiPost('mgmt/password/reset', data)

}

export const recoverPasswordAPI = data => {

    return apiPost('mgmt/password/update', data)

}

export const renewSessionAPI = (headers = {}) => {

    return apiGet('session/renew', {}, headers)

}

export const reviewCompanyAgreementAPI = (email, password) => {
    return apiPost(`mgmt/session/reviewCompanyAgreement`, {email, password})
}