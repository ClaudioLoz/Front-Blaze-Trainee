import axios from 'axios';
import {apiUrl, roles, roleLevels, apiUrlV2} from './constants';
import qs from 'query-string';
import { openSuccessMessage, openErrorMessage } from '../actions/message';
import { startLoading, stopLoading } from '../actions/loading';

export function saveObject(key, value) {
	if (window && window.localStorage) {
		window.localStorage.saveObject(key, value);
	}
}

export function removeObject(key) {
	if (window && window.localStorage) {
		window.localStorage.removeItem(key);
	}
}

export function getObject(key) {
	if (window && window.localStorage) {
		return window.localStorage.getObject(key);
	}

	return null;
}

export function logOut() {
	return new Promise((res, rej) => {
		localStorage.removeItem('session');
		localStorage.removeItem('time');
		localStorage.removeItem('docuSign')
		res(true);
	})
}

export function isLoggedIn() {
	let session = getObject('session');

	let accessToken = session && session.accessToken;

	return accessToken;
}

export function hasAccess() {
	let session = getObject('session');
	if (session == null) {
		return false;
	}
	return !!(session.employee && session.employee.role && session.employee.role.permissions.find((perm) => perm === "WebSettingsManage")) ? true : false;
}

export function getDataAssignedShop() {
    let session = getObject('session');
    if (session == null) {
        return false;
    }
    return session && session.assignedShop;
}

export function getEmployeeShops() {
    let session = getObject('session');
    return session && session.employee && session.employee.shops || [];
}

export function canCreateOrEditMasterCategory() {
    let session = getObject('session');
    if (session == null) {
        return false;
    }

	const role = session.employee && session.employee.role || {};
	if(role.name == "Admin"){
		return true;
	} else {
		return (role.permissions && role.permissions.find((perm) => perm === "WebMasterCategoryCatalog")) ? true : false;
	}
}

export function canCreateOrEditMasterProduct() {
    let session = getObject('session');
    if (session == null) {
        return false;
    }

	const role = session.employee && session.employee.role || {};
	if(role.name == "Admin"){
		return true;
	} else {
		return (role.permissions && role.permissions.find((perm) => perm === "WebMasterProductCatalog")) ? true : false;
	}
}

export function canCreateOrEditShopLevelMasterCategory() {
    let session = getObject('session');
    if (session == null) {
        return false;
    }

	const role = session.employee && session.employee.role || {};
	if(role.name == "Admin"){
		return true;
	} else {
		return (role.permissions && role.permissions.find((perm) => perm === "WebShopLevelCategoryCatalog")) ? true : false;
	}
}

export function canCreateorEditShopLevelMasterProduct() {
    let session = getObject('session');
    if (session == null) {
        return false;
    }

	const role = session.employee && session.employee.role || {};
	if(role.name == "Admin"){
		return true;
	} else {
		return (role.permissions && role.permissions.find((perm) => perm === "WebShopLevelProductCatalog")) ? true : false;
	}
}

export const checkAccessToShop = (shopId, type) => {
	const session = getSession();
	const { employeeShops, employee } = session || {};
	const { role } = employee || {};

	if(role && role.name == "Admin"){
		return true;
	}else{
		let hasShopPermission = false;
		if(type === "product"){
			hasShopPermission = canCreateorEditShopLevelMasterProduct();
		}else if(type === "category"){
			hasShopPermission = canCreateOrEditShopLevelMasterCategory();
		}
		if(!hasShopPermission){
			return false;
		}else{
			return !!employeeShops.find(shop => shop.id == shopId);
		}
	}
}

export const checkAccessToMaster = (type) => {
	const session = getSession();
	const { employeeShops, employee, shops=[] } = session || {};
	const { role } = employee || {};

	if(role && role.name == "Admin"){
		return true;
	}else{
		if(type === "product"){
			return canCreateOrEditMasterProduct();
		}else if(type === "category"){
			return canCreateOrEditMasterCategory();
		}
		
	}
}

export function getHeaders() {
	let session = getSession();
	return {
		Authorization: `Token ${(session && session.accessToken) || null}`
	}
}


export function getSession() {
	if (window && window.localStorage) {
		return window.localStorage.getItem('session');
	}

	return null;
}

export function saveSession(value) {
	if (window && window.localStorage) {
		window.localStorage.setItem("returnShopId", value.assignedShop && value.assignedShop.id)
		return window.localStorage.saveObject('session', value);
	}

	return null;
}

export function saveDocuSign(value) {
	if (window && window.localStorage) {
		return window.localStorage.saveObject('docuSign', value);
	}

	return null;
}

export function getDocuSign() {
	if (window && window.localStorage) {
		return window.localStorage.getObject('docuSign');
	}

	return null;
}

export function generateUrl(path, lastVersion = false) {
    return lastVersion ? apiUrlV2 + path : apiUrl + path;
}

export function apiReq(endPoint, data, method, headers, requestOptions = {}) {
	return new Promise((res, rej) => {

		headers = {
			...getHeaders(),
			...headers
		}
		if (method === 'get' || method === 'delete') {
			data = {
				...requestOptions,
				params: data,
				paramsSerializer: function (params) {
					return qs.stringify(params, { arrayFormat: 'repeat' })
				},
				headers
			}
		}

		axios[method](endPoint, data, { headers }).then((result) => {
			let { data } = result;

			if (data.status === false) {
				return rej(data);
			}

			return res(data);
		}).catch((err) => {
			return rej(err);
		});
	})
}

export function apiPost(endPoint, data, headers = {}) {
	return apiReq(generateUrl(endPoint), data, 'post', headers);
}

export function apiDelete(endPoint, data, headers = {}) {
	return apiReq(generateUrl(endPoint), data, 'delete', headers);
}

export function apiGet(endPoint, data, headers = {}, requestOptions, lastVersion = false) {
    return apiReq(generateUrl(endPoint, lastVersion), data, 'get', headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}) {
	return apiReq(generateUrl(endPoint), data, 'put', headers);
}

export function multiPartData(data) {

	let multiPart = new FormData();

	for (let prop in data) {
		multiPart.append(prop, data[prop]);
	}

	return multiPart;
}

export function addMessageCurry(promise, dispatch, errorMsg = '', successMsg = '', showLoading = true, showError = true) {

	return new Promise(
		(resolve, reject) => {

			if (showLoading) {
				dispatch(startLoading())
			}

			promise
				.then(response => {

					if (successMsg) {
						dispatch(
							openSuccessMessage(successMsg)
						)
					}

					if (showLoading) {
						dispatch(stopLoading())
					}

					resolve(response)
				})
				.catch(
					err => {
						if(showError) {
							 dispatch(
								openErrorMessage(errorMsg || ((err.response && err.response.data.message) || 'Server encountered an error'))
							)
						}

						if (showLoading) {
							dispatch(stopLoading())
						}

						reject(err)
					}
				)

		}
	)

}

export const commonActionAPIHit = (apiToHit, errorMsg, successMsg, showModal = true) => {
    return data => {
        return dispatch => {
            return new Promise(
                (resolve, reject) => {
                    addMessageCurry(apiToHit(data), dispatch, errorMsg, successMsg, showModal)
                        .then(result => {
                            resolve(result);
                        })
                }
            )
        }
    }
}

export const createGetUrl = (assetId) => {

	let session = getSession();
	let token = (session && session.assetAccessToken) || null;

	//console.log(session)

	return apiUrl + 'mgmt/assets/' + assetId + `?assetToken=${encodeURIComponent(token)}`
}

export const parseJwt = token => {
	console.log(token, token.split('.'), "token")
	var base64Url = token.split('.');
	var base64 = base64Url[0].replace(/\+/g, '%20')
	console.log(base64, atob(base64).split(''), "base 64")
	var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	console.log(base64, jsonPayload, "payload")
	return JSON.parse(jsonPayload);
}

export const getEmployeeRoleLevel = role => {
	let roleLevel = roleLevels.OTHER
	if(role){
		const roleName = role.name;
		if(roleName === roles.ADMIN) {
			roleLevel = roleLevels.ADMIN
		}else if(roleName === roles.MANAGER) {
			roleLevel = roleLevels.MANAGER
		}else if(roleName === roles.SHOP_MANAGER || roleName === roles.SHOP_DISPATCHER || roleName === roles.DISPATCHER) {
			roleLevel = roleLevels.SHOP_MANAGER_AND_DISPATCHER
		}else if(roleName === roles.INACTIVE) {
			roleLevel = roleLevels.INACTIVE
		}
	}
	return roleLevel;
}

export const getActiveUser = () => {
	const session = getSession();
    return session && session.employee
}

export const getActiveUserRole = () => {
	const session = getSession();
    const activeUser = session && session.employee
	return activeUser && activeUser.role
}

export const canManageEmployee = employeeRole => {
	let manageEmployee = false;

	if(!employeeRole) {
		return manageEmployee
	}

	const activeUserRole = getActiveUserRole();
	const activeUserRoleLevel = getEmployeeRoleLevel(activeUserRole)

	const employeeRoleLevel = getEmployeeRoleLevel(employeeRole)
	if(activeUserRoleLevel.enableManageEmployee){
		if(activeUserRoleLevel.canManageSameRole){
			manageEmployee = activeUserRoleLevel.level <= employeeRoleLevel.level
		} else{
			manageEmployee = activeUserRoleLevel.level < employeeRoleLevel.level
		}
	}
	return manageEmployee;
}

export const canAddEmployee = () => {
	const activeUserRole = getActiveUserRole();
	const activeUserRoleLevel = getEmployeeRoleLevel(activeUserRole)
	return activeUserRoleLevel.enableManageEmployee
}

export const canEditRole = selectedRole => {
	let editRole = false;

	if(!selectedRole) {
		return editRole
	}

	const activeUserRole = getActiveUserRole();
	const activeUserRoleLevel = getEmployeeRoleLevel(activeUserRole)

	const selectedRoleLevel = getEmployeeRoleLevel(selectedRole)
	if(activeUserRoleLevel.canManageSameRole){
		editRole = activeUserRoleLevel.level <= selectedRoleLevel.level
	} else{
		editRole = activeUserRoleLevel.level < selectedRoleLevel.level
	}

	return editRole;
}