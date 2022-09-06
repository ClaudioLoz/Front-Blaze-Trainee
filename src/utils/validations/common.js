import { isValidString } from '../string';

export const globalValidator = (data, keys) => {
    for (let i in keys) {
        const key = keys[i];
        switch (key.validateKey) {
            case 'email': if (!checkEmail(data[key.name])) {
                return 'Please provide valid email'
            }
                break;
            case 'required': if (!isValidString(data[key.name] && data[key.name].toString())) {
                return `${key.title} is Required`
            }
                break;
            case 'phone': if (!checkPhone(data[key.name])) {
                return `Please provide valid phone number`
            }
                break;
            default: 
                    break;
        }
    }
    return true;
}

export const checkEmail = (email) => {
    if (!isValidString(email)) {
        return false
    }
    var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return emailRegEx.test(email);
}

export const checkPhone = (phoneNo) => {
    if (phoneNo && phoneNo.length >10) {
        // var phoneRegEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        // return phoneRegEx.test(phoneNo);
        return true
    }
    else {
        return false;
    }
}