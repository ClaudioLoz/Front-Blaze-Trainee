import Validator from 'is_js';
import { isEmpty } from 'lodash';

export default function validateInput(data) {

    let errors = {};

    if (Validator.empty(data.firstName)){
        errors.firstName = 'First name is required.';
    }
    if(!data.firstName.trim()){
        errors.firstName = 'First Name is required.'
    }

    if (Validator.empty(data.lastName)) {
        errors.lastName = 'Last name is required.';
    }

    if(!data.lastName.trim()){
        errors.lastName = 'Last Name is required.'
    }

    if (Validator.empty(data.pin)) {
        errors.pin = 'Pin is required.';
    }

    if (Validator.empty(data.email)) {
        errors.email = 'Email is required.';
    }

    if (!Validator.empty(data.email) && !Validator.email(data.email)) {
        errors.email = 'Invalid Email.';
    }

    if (Validator.empty(data.password)) {
        errors.password = 'Password is required.'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}