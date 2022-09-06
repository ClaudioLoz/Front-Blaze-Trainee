import PureItemHOC from "../../containers/HOC/PureItemHOC";

import { partial } from "../../utils/common";

import {EditableNumericInput, EditableCheckbox, EditableTextField, EditableSwitch, EditableSelect, EditableReactSelectCreatable } from "./EditableComponents";
import EditActionComponent from "./EditActionComponent";
import { TableCell } from "@material-ui/core";


export const PureTableCell = partial(PureItemHOC, ({
    className: "cell-wrap-word"
}), TableCell)

export const TableCellWhitNumericField = PureTableCell(EditableNumericInput)
export const TableCellWithTextField = PureTableCell(EditableTextField)
export const TableCellWithCheckbox = PureTableCell(EditableCheckbox)
export const TableCellWithSelect = PureTableCell(EditableSelect)
export const TableCellWithSwitch = PureTableCell(EditableSwitch)
export const TableCellWithActionComponent = PureTableCell(EditActionComponent)
export const TableCellWithMultipleSelect = PureTableCell(EditableReactSelectCreatable)
export const TableCellWithText = PureTableCell('span')