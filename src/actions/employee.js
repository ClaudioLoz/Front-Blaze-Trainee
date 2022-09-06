import { SET_EMPLOYEES, SET_ADMIN_EMPLOYEES, SET_TIME_CARDS, SET_ROLES, SET_INVITED_EMPLOYEES, SET_TIME_CARDS_ACTIVE } from '../types/employee';
import {
    fetchEmployeesAPI,
    fetchAdminEmployeesAPI,
    updateEmployeeAPI,
    getInvitedEmployeeByTokenAPI,
    createNewInviteEmployeeAPI,
    getTimeCardListAPI,
    getRolesAPI,
    saveNewEmployeeAPI,
    fetchEmployeeByIdAPI,
    deleteEmployeeAPI,
    clockOutAPI,
    fetchEmployeesWithTermAPI,
    fetchInvitedEmployeesAPI,
    resendInviteAPI,
    createNewEmployeeByInviteAPI,
    searchEmployeesAPI,
    getTimecardsHistoryAPI,
    updateTimecardAPI
} from '../api/employee';
import { addMessageCurry } from '../utils/api';
import { getCurrentSession } from '../actions/auth';
import { openErrorMessage, openSuccessMessage } from './message';

export const setEmployees = (payload) => {
    return ({
        type: SET_EMPLOYEES,
        payload
    });
}

export const setAdminEmployees = (payload) => {
    return ({
        type: SET_ADMIN_EMPLOYEES,
        payload
    });
}

export const setInvitedEmployees = (payload) => {
    return ({
        type: SET_INVITED_EMPLOYEES,
        payload
    });
}

export const setTimeCards = (payload) => {
    return ({
        type: SET_TIME_CARDS,
        payload
    });
}

export const setTimeCardsActive = (payload) => {
    return ({
        type: SET_TIME_CARDS_ACTIVE,
        payload
    });
}

export const setRoles = (payload) => {
    return ({
        type: SET_ROLES,
        payload
    });
}

export const fetchEmployees = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(fetchEmployeesAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(setEmployees(res.values));
                        resolve(res);
                    })
            }
        )
    }
}

export const fetchAdminEmployees = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(fetchAdminEmployeesAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(setAdminEmployees(res.values));
                        resolve(res);
                    })
            }
        )
    }
}

export const updateEmployee = (payload, shop) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateEmployeeAPI(payload), dispatch, '', 'Employee Details Updated Successfully!', true)
                    .then(res => {
                        dispatch(getCurrentSession())
                        resolve(res);
                    })
            }
        )
    }
}

export const getInvitedEmployeeByToken = (payload, shop) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getInvitedEmployeeByTokenAPI(payload), dispatch)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        )
    }
}

export const createNewInviteEmployee = (payload, shop) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(createNewInviteEmployeeAPI(payload), dispatch)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        )
    }
}

export const getTimeCardList = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getTimeCardListAPI(payload), dispatch)
                    .then(res => {
                        dispatch(setTimeCards({ timecards: res.values }));
                        resolve(res);
                    })
            }
        )
    }
}

export const getTimecardsHistory = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getTimecardsHistoryAPI(payload), dispatch)
                    .then(res => {
                        dispatch(setTimeCardsActive(res));
                        resolve(res);
                    })
            }
        )
    }
}

  export const updateTimecard = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(updateTimecardAPI(payload), dispatch, '', "Timecard Updated Successfully!", true)
                    .then(res => {
                        dispatch(getTimecardsHistory());
                        resolve(res);
                    })
            }
        )
    }
}

export const getRoles = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getRolesAPI(payload), dispatch)
                    .then(res => {
                        dispatch(setRoles({ roles: res.values }));
                        resolve(res);
                    })
            }
        )
    }
}

export const saveNewEmployee = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(saveNewEmployeeAPI(payload), dispatch, '', "Employee Created Successfully!", true)
                    .then(res => {
                        dispatch(setRoles({ roles: res.values }));
                        resolve(res);
                    })
            }
        )
    }
}


export const fetchEmployeeById = (id = '') => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(fetchEmployeeByIdAPI(id), dispatch, '', '', true)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const deleteEmployee = (id = '') => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(deleteEmployeeAPI(id), dispatch, '', 'Employee Deleted Successfully.', true)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}

export const clockOut = (id = '') => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(clockOutAPI(id), dispatch, '', 'Clocked Out Successfully.', true)
                    .then(res => {
                        resolve(res);
                    })
            }
        )
    }
}


export const searchEmployees = (payload = '') => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(fetchEmployeesWithTermAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(setEmployees(res.values));
                        resolve(res);
                    })
            }
        )
    }
}

export const fetchInvitedEmployees = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(fetchInvitedEmployeesAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(setInvitedEmployees({ employees: res.values }));
                        resolve(res);
                    })
            }
        )
    }
}

export const resendInvite = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(resendInviteAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(openSuccessMessage("Invitation sent Successfully"));
                        resolve(res);
                    })
            }
        )
    }
}

export const createNewEmployeeByInvite = (payload = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(createNewEmployeeByInviteAPI(payload), dispatch, '', '', true)
                    .then(res => {
                        dispatch(openSuccessMessage("Invitation sent Successfully"));
                        resolve(res);
                    })
            }
        )
    }
}

export const searchEmployee = (term) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        searchEmployeesAPI(term)
          .then((url) => {
            resolve(url);
          })
          .catch((err) => {
              dispatch(openErrorMessage("Error whil searching an employee, please contact support"))
              console.log(err)
            });
      });
    };
};