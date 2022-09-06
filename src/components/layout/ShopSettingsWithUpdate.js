import React, { PureComponent } from 'react';

import {
    connect
} from 'react-redux';

import { updateShop } from '../../actions/shop';

class ShopSettings extends PureComponent {

    updateShop = (shop) => {
        return this.props.dispatch(updateShop(shop));
    }

    render () {

        const { WrappedComponent, WrappedProps } = this.props; 
        
        const { session={} } = this.props.authReducer;
        const { assignedShop={} } = session || {};
        return <WrappedComponent shop={assignedShop} updateShop={this.updateShop} {...WrappedProps} />

    }

}

const ShopSettingsConnected = connect((state) => ({
    dispatch: state.dispatch,
    authReducer: state.authReducer
}))(ShopSettings);


const WithShop = (WrappedComponent) => props => {
    return <ShopSettingsConnected
        WrappedComponent={WrappedComponent}
        WrappedProps={props}
    /> 

}

export default WithShop;