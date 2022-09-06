import React, { PureComponent } from 'react';
import NumericInput from 'react-numeric-input';

export default class CustomNumericInput extends PureComponent {
    
    render() {
        const { value, onChange, placeholder, precision=2, step=1, strict = false, max= Number.MAX_SAFE_INTEGER, onKeyDown = null , min = 0} = this.props;
        return (<div className="custom_numeric_input">
            <NumericInput 
                placeholder={placeholder}
                value={value}
                className="numeric-material-input"
                mobile={false}
                onChange={onChange}
                strict={strict}
                max={max}
                onKeyDown={onKeyDown}
                min={min}
                precision={precision}
                step={step}
                strict={strict}
                max={max}
                onKeyDown={onKeyDown}
            />
        </div>
        )
    }
}