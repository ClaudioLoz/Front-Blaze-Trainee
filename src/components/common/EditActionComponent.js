import React, { Fragment, PureComponent } from 'react';
import { Button } from '@material-ui/core';
import '../../style/common.css'
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
                            {!hideSave ? <Button className={classButton} onClick={onSave} variant="contained">Save</Button> : null}
                            <Button className={classButtonDelete} onClick={onCancel} variant="contained">Cancel</Button>
                        </Fragment>
                        :
                        <Button className={classButton} onClick={onEdit} variant="contained" color="blue">{editTitle}</Button>
                }
            </div>
        )

    }

}