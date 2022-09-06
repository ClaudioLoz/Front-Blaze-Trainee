import { Select, Checkbox, TextField, Input, Switch } from '@material-ui/core';
import MultiSelect, { Creatable, Async } from 'react-select';
import SingleSelect from 'react-select/lib/Select';
import EditableInputHOC from '../../../containers/HOC/EditableInputHOC';
import EditorComponent from '../../Editor/EditorComponent';
import TextArea from '../TextArea';
import CustomNumericInput from '../CustomNumericInput';
import DateTime from 'react-datetime'

export const EditableSelect = EditableInputHOC(Select)
export const EditableCheckbox = EditableInputHOC(Checkbox)
export const EditableTextField = EditableInputHOC(TextField)
export const EditableInput = EditableInputHOC(Input)
export const EditableSwitch = EditableInputHOC(Switch)
export const EditableTextArea = EditableInputHOC(TextArea)
export const EditableReactSelect = EditableInputHOC(MultiSelect)
export const EditableReactSingleSelect = EditableInputHOC(SingleSelect)
export const EditableReactSelectCreatable = EditableInputHOC(Creatable)
export const EditableReactSelectAsync = EditableInputHOC(Async)
export const EditableDraftEditor = EditableInputHOC(EditorComponent)
export const EditableNumericInput = EditableInputHOC(CustomNumericInput)
export const EditableDateInput = EditableInputHOC(DateTime)