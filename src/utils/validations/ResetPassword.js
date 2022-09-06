import Validator from 'is_js';
import { isEmpty } from 'lodash';

export default function validateInput(data) {
    let errors = {};

    if (Validator.empty(data.password)) {
        errors.password = 'Password is required.'
    }
    
    if(Validator.empty(data.confirmPassword))
        errors.confirmPassword = 'Confirmation password is required.';

    if(!Validator.empty(data.password) && !Validator.empty(data.confirmPassword) && !Validator.equal(data.password, data.confirmPassword))
        errors.confirmPassword = 'Password & Confirmation Password doesn\'t match.';

    return {
        errors,
        isValid: isEmpty(errors)
    }
}