import React, { Fragment, PureComponent } from 'react';
import { Button } from '@material-ui/core';

export default class CreateActionRegion extends PureComponent {

    render() {

        const {
            onSave,
            onCancel
        } = this.props
        return (
            <div>
                        <Fragment>
                            <Button className="primary-button margin" onClick={onSave}>Save</Button>
                            {/* <Button className="danger-button margin" onClick={onCancel}>Cancel</Button> */}
                        </Fragment>

            </div>
        )

    }

}