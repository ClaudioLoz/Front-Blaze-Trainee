import React, { Fragment, PureComponent } from 'react';
import { Button } from '@material-ui/core';

export default class EditActionComponent extends PureComponent {

    render() {

        const {
            onSave,
            onCancel,
            onEdit,
            editMode,
            className = "btn-scr",
            classButton = "primary-button margin",
            classButtonDelete = "danger-button margin",
            editTitle = "Edit",
            hideSave = false
        } = this.props
        return (
            <div className={className} style={{
                display: 'inline'
            }}>
                {
                    editMode
                        ?
                        <Fragment>
                            {!hideSave ? <Button data-cy="btn-save-item" className={classButton} onClick={onSave}>Save</Button> : null}
                            <Button className={classButtonDelete} onClick={onCancel}>Cancel</Button>
                        </Fragment>
                        :
                        <Button data-cy="btn-edit-item" className={classButton} onClick={onEdit}>{editTitle}</Button>
                }
            </div>
        )

    }

}