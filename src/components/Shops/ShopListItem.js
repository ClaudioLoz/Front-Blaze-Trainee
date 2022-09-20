import React, { Component } from 'react';
import { TableRow } from '@material-ui/core';

// utils
import { onChangeEditHOF } from '../../utils/common';
import { hasAccess } from '../../utils/api';
import { TableCellWithTextField, TableCellWithSwitch, TableCellWithActionComponent, TableCellWithText } from '../common/PureItems';

export default class ShopListItem extends Component {

    onChange = onChangeEditHOF(this.props.onChange)

    onSave = () => {

        this.props.onSave(response => this.props.disableEdit())

    }

    onCancel = () => {

        this.props.onCancel()

    }

    render() {

        const {
            data,
            editMode,
            shopTerminalsLength
        } = this.props;

        return (
            <TableRow>
                <TableCellWithTextField
                    valueToRender={data.name}
                    editMode={editMode}
                    value={data.name}
                    onChange={this.onChange('name')}
                    type="text"
                />
                <TableCellWithText
                >
                    {data.appTarget === 'Distribution' ? 'Distro' : data.appTarget || ''}
                </TableCellWithText>
                <TableCellWithSwitch
                    valueToRender={data.active ? 'Active' : 'Inactive'}
                    checked={data.active}
                    editMode={editMode}
                    onChange={this.onChange('active', true)}
                />
                <TableCellWithText
                >
                    {shopTerminalsLength}
                </TableCellWithText>
                {hasAccess() ? <TableCellWithActionComponent
                    onSave={this.onSave}
                    onCancel={this.onCancel}
                    onEdit={this.props.enableEdit}
                    editMode={editMode}
                /> : null}
            </TableRow>
        )

    }

}