import React from 'react';
import { FormControl, InputLabel } from '@material-ui/core';

import { EditableInput } from './EditableComponents';

const FormControlWithEditableInput = ({label, ...editableInputProps}) => 
    <FormControl className="margin-bottom-small margin">
        { editableInputProps.editMode ? <InputLabel>{label}</InputLabel> : <p>{label}</p>}
        <EditableInput
            {...editableInputProps}
        />
    </FormControl>

export default FormControlWithEditableInput;