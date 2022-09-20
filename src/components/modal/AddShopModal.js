import React, { PureComponent } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Input } from '@material-ui/core';

import { isValidString } from '../../utils/string';

import ForwardRefHOC from '../../containers/HOC/ForwardRefHOC';
import ModalDialog from '../common/ModalDialog';

class AddShopModal extends PureComponent {


    constructor() {
        super();
        this.state = {
            NewShopName: '',
            appTarget: 'Retail'
        };
      }

    addShop = () => {

        const {
            NewShopName,
            appTarget
        } = this.state;

        if (!isValidString(NewShopName)) {
            this.props.onError('Please provide a valid shop name');
            return;
        }

        this.props.addShop({ name: NewShopName, appTarget })


    }

    onClose = () => {

        this.setState({
            NewShopName: ''
        })

    }

    onOpen = type => {

        this.setState({
            NewShopName: '',
            appTarget: type || 'Retail'
        })

    }

    onNewShopChange = key => e => {
        this.setState({
            [key]: e.target.value
        })
    }

    render() {

        const { forwardedRef } = this.props;

        const {
            NewShopName,
            appTarget
        } = this.state;

        return (
            <ModalDialog
                title={'Add Shop'}
                ref={forwardedRef}
                onConfirm={this.addShop}
                onClose={this.onClose}
                onOpen={this.onOpen}
            >
                <FormControl fullWidth className="margin-bottom-small">
                    <InputLabel>Shop name *</InputLabel>
                    <Input
                        value={NewShopName}
                        onChange={this.onNewShopChange('NewShopName')}
                        fullWidth
                    />
                </FormControl>
                <FormControl fullWidth className="margin-bottom-small">
                    <InputLabel>Shop type *</InputLabel>
                    <Select value={appTarget} onChange={this.onNewShopChange('appTarget')}>
                        <MenuItem value="Retail">Retail</MenuItem>
                        <MenuItem value="Distribution">Distro</MenuItem>
                        <MenuItem value="Grow">Grow</MenuItem>
                    </Select>
                </FormControl>
            </ModalDialog>
        )

    }

}

export default ForwardRefHOC(AddShopModal);