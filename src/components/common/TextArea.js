import React from 'react';
import { TextField } from '@material-ui/core';

const TextArea = props =>
    <TextField rows={3} multiline {...props} />

export default TextArea;