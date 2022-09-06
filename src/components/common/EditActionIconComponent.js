import React, { Fragment, PureComponent } from 'react';
import { IconButton } from '@material-ui/core';
import {
    Close,
    Check,
    Edit
} from '@material-ui/icons'
export default class EditActionIconComponent extends PureComponent {

    render () {

        const {
            onSave,
            onCancel,
            onEdit,
            editMode,
            className,
            hideSave = false
        } = this.props

        return (
            <div className={className}>
                {
                    editMode
                    ? 
                        <Fragment>
                            { !hideSave ? <IconButton className="primary-button" onClick={onSave}><Check /></IconButton> : null }
                            <IconButton className="danger-button" onClick={onCancel}><Close /></IconButton>
                        </Fragment>
                    :
                    <IconButton className="primary-button" onClick={onEdit}><Edit /></IconButton>
                }
            </div>
        )

    }

}