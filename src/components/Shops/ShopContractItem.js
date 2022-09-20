import React, { Component, Fragment } from 'react';
import { Button, TableRow, TableCell } from '@material-ui/core';

// utils
import { onChangeEditHOF, toLocalDate } from '../../utils/common';
import { hasAccess } from '../../utils/api';

import { EditableSwitch } from '../common/EditableComponents';
import EditActionComponent from '../common/EditActionComponent';
import ModalDialog from '../common/ModalDialog';
import PDFViewer from '../common/PDFViewer';

export default class ShopContractItem extends Component {

    onChange = onChangeEditHOF(this.props.onChange)

    onSave = () => {

        this.props.onSave(response => this.props.disableEdit())

    }

    onCancel = () => {

        this.props.onCancel()

    }

    openViewModal = () => {
        this.viewModal.handleClickOpen()
    }

    render () {

        const {
            data,
            editMode
        } = this.props;

        return (
            <Fragment>
                <TableRow>
                    <TableCell className="cell-wrap-word">{data.version}</TableCell>
                    <TableCell className="cell-wrap-word">{data.name}</TableCell>
                    <TableCell className="cell-wrap-word">{data.contentType}</TableCell>
                    <TableCell className="cell-wrap-word">
                        <EditableSwitch
                            valueToRender={data.active ? 'Active': 'Inactive'}
                            checked={data.active}
                            editMode={editMode}
                            onChange={this.onChange('active', true)}
                        />
                    </TableCell>
                    <TableCell className="cell-wrap-word">
                        <EditableSwitch
                            valueToRender={data.required ? 'Active': 'Inactive'}
                            checked={data.required}
                            editMode={editMode}
                            onChange={this.onChange('required', true)}
                        />
                    </TableCell>
                    <TableCell className="cell-wrap-word">
                        <EditableSwitch
                            valueToRender={data.enableWitnessSignature ? 'Active': 'Inactive'}
                            checked={data.enableWitnessSignature}
                            editMode={editMode}
                            onChange={this.onChange('enableWitnessSignature', true)}
                        />
                    </TableCell>
                    <TableCell className="cell-wrap-word">
                        <EditableSwitch
                            valueToRender={data.enableEmployeeSignature ? 'Active': 'Inactive'}
                            checked={data.enableEmployeeSignature}
                            editMode={editMode}
                            onChange={this.onChange('enableEmployeeSignature', true)}
                        />
                    </TableCell>
                    <TableCell className="cell-wrap-word">{toLocalDate(data.created)}</TableCell>
                    <TableCell className="cell-wrap-word">
                       
                    </TableCell>{hasAccess() ? <EditActionComponent
                            onSave={this.onSave}
                            onCancel={this.onCancel}
                            onEdit={this.props.enableEdit}
                            editMode={editMode}
                        /> : null }
                        {
                            !editMode ? <Button onClick={this.openViewModal} className="primary-button margin">View</Button> : null
                        }
                </TableRow>
                <ModalDialog
                    hideSave
                    title={data.name}
                    ref={c => this.viewModal = c}
                >
                    {
                        data.contentType === 'TEXT' ? data.text : null
                    }
                    {
                        data.contentType === 'PDF' ? <PDFViewer pdfKey={data.pdfFile && data.pdfFile.key} /> : null
                    }
                </ModalDialog>
            </Fragment>
        )

    }

}