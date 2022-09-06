import React from "react";
import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/dist/style.css';

const ReactPhoneInput = (props) => {
    const {
        defaultCountry = '',
        onChange,
        value,
        placeholder,
        preferredCountries = [],
        onlyCountries = [],
        excludeCountries = [],
        inputClass="",
        containerClass="",
        name=""
    } = props;

    return(
            <PhoneInput
                country = {defaultCountry}
                onChange = {onChange}
                value = {value}
                placeholder = {placeholder}
                preferredCountries = {preferredCountries || []}
                onlyCountries = {onlyCountries || []}
                excludeCountries = {excludeCountries || []}
                inputClass={inputClass}
                containerClass={`react-tel-input ${containerClass}`}
                inputExtraProps={{
                    name:`${name}`
                }}
            />
        )            
}

export default ReactPhoneInput