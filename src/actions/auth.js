import { AUTH_SUCCESS, SAVE_DOCUSIGN_INFO } from '../types/auth';
import { loginAPI, switchAppAPI, changeShopAPI, getCurrentSessionAPI, resetPasswordAPI, recoverPasswordAPI, renewSessionAPI, reviewCompanyAgreementAPI } from '../api/auth';
import { addMessageCurry, getSession, commonActionAPIHit } from '../utils/api';
import momentTZ from 'moment-timezone';
import { saveUpdatedShop } from './shop';
import { stringFormatter } from '../utils/common';


export const authSuccess = payload => ({
    type: AUTH_SUCCESS,
    payload: payload
})

export const setDocuSignInfo = payload => ({
    type: SAVE_DOCUSIGN_INFO,
    payload: payload
})

export const changeShop = (shopId, appType = '') => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                const data = appType ? { shopId, growAppType: appType } : { shopId }

                addMessageCurry(changeShopAPI(data), dispatch)
                    .then(session => {
                        resolve(session);
                        dispatch(authSuccess({ session }));
                    })

            }
        )
    }
}

export const switchApp = data => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {

                const session = getSession();

                addMessageCurry(switchAppAPI({
                    ...data,
                    accessToken: session.accessToken
                }), dispatch)
                    .then(session => {
                        resolve(session)
                    })
                    .catch(
                        err => console.log(err)
                    )
            })
    }
}


export const getCurrentSession = (headers = {}) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(getCurrentSessionAPI(headers), dispatch)
                    .then(session => {
                        resolve(session)
                        dispatch(authSuccess({ session }))
                    })
                    .catch(
                        err => console.log(err)
                    )
            }
        )
    }
}

export const login = user => {
    return dispatch => {

        const timezone = momentTZ.tz.guess()

        const data = { ...user, timezone }

        return new Promise(
            (resolve, reject) => {

                addMessageCurry(loginAPI(data), dispatch)
                    .then(session => {
                        resolve(session)
                        dispatch(authSuccess({ session }))
                    })
                    .catch(
                        err => reject(err)
                    )

            }
        )

    }
}
export const login2 = user => {
    return dispatch => {

        const timezone = momentTZ.tz.guess()

        const data = { ...user, timezone }

        return new Promise(
            (resolve, reject) => { resolve("dummy");

            }
        )

    }
}

export const renewSession = (payload) => {
    return dispatch => {
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(renewSessionAPI(payload), dispatch)
                    .then(session => {
                        resolve(session)
                        dispatch(saveUpdatedShop({ session, shop: session.assignedShop }))
                    })
                    .catch(
                        err => console.log(err)
                    )
            })
    }
}

export const reviewCompanyAgreement = (email, password) =>{
    let formattedEmail = stringFormatter(email);
    return dispatch =>{
        return new Promise(
            (resolve, reject) => {
                addMessageCurry(reviewCompanyAgreementAPI(formattedEmail, password), dispatch)
                    .then(session => {
                        if(session){
                            dispatch(setDocuSignInfo(session)) 
                        }
                        resolve(session)
                    })
                    .catch(
                        err => reject(err)
                    )
            }
        )
    }
}
export const reviewCompanyAgreement2 = (email, password) =>{
    let formattedEmail = stringFormatter(email);
    return dispatch =>{
        return new Promise(
            (resolve, reject) => {
                    resolve("dummy");
            }
        )
    }
}
export const resetPassword = commonActionAPIHit(resetPasswordAPI, null, 'Password reset submitted, Please check your email')
export const recoverPassword = commonActionAPIHit(recoverPasswordAPI, null, 'Password updated successfully')
