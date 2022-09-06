import { apiPost, apiGet, apiPut, apiDelete } from "../utils/api";

export const fetchEmployeesAPI = data => {
    return apiGet(`mgmt/employees`, data);
}

export const fetchAdminEmployeesAPI = data => {
    return apiGet(`mgmt/employees/admins`, data);
}

export const fetchEmployeesWithTermAPI = (term) => {
    return apiGet(`mgmt/employees?term=${term}`);
}

export const updateEmployeeAPI = data => {

    return apiPost(`mgmt/employees/${data.id}`, data);

}

export const getInvitedEmployeeByTokenAPI = (token) => {
    var tokenData = {
        "token": token
    }
    return apiPost('mgmt/employee-invite/employee-info', tokenData);
}

export const createNewInviteEmployeeAPI = (invitation = {}) => {
    return apiPut('mgmt/employee-invite', invitation);
}

export const getTimeCardListAPI = () => {
    return apiGet('mgmt/timecards');
}

export const getTimecardsHistoryAPI = () => {
    return apiGet('mgmt/timecards/history');
}

export const updateTimecardAPI = (timecard) => {
    return apiPost(`mgmt/timecards/${timecard.id}`, timecard);
}

export const getRolesAPI = () => {
    return apiGet('mgmt/roles');
}

export const saveNewEmployeeAPI = (employee) => {
    return apiPost('mgmt/employees', employee);
}

export const fetchEmployeeByIdAPI = (id) => {
    return apiGet(`mgmt/employees/${id}`)
}

export const deleteEmployeeAPI = (id) => {
    return apiDelete(`mgmt/employees/${id}`)
}

export const clockOutAPI = (id) => {
    return apiDelete(`mgmt/timecards/${id}/admin`)
}

export const fetchInvitedEmployeesAPI = () => {
    return apiGet(`mgmt/employee-invite`);
}

export const resendInviteAPI = (inviteEmployeeId) => {
    return apiGet('mgmt/employee-invite/'+inviteEmployeeId+'/resendInviteEmployee');
}

export const createNewEmployeeByInviteAPI = (data) => {
    return apiPost('mgmt/employee-invite', data).then(({data}) => data)
}

export const searchEmployeesAPI = (term) => {
    return apiGet(`mgmt/employees/search?term=${term}&limit=50&start=0`);
}