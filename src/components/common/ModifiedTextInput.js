import React, { PureComponent } from 'react';
import {
    TextField
} from '@material-ui/core';

export default class ModifiedTextInput extends PureComponent {

    render() {
        return (
            <TextField
                inputProps={{
                    style: {
                        padding: '15px 20px'
                    }
                }}
                fullWidth
                InputProps={{ // eslint-disable-line
                    classes: {
                        underline: 'thick-underlined'
                    }
                }}
                {...this.props}
            />
        )

    }

}