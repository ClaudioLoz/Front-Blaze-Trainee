import React, { PureComponent } from 'react';
import { connect } from 'react-redux';


import { getShopTerminals } from '../../../actions/shop';

import ShopInfo from '../../../components/Shops/ShopInfo';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import EditableHOCWrapper from '../../HOC/EditableHOC';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';

const ShopInfoEditable = EditableHOCWrapper(ShopInfo)

class ShopInfoContainer extends PureComponent {

    componentDidMount() {
        const { shop } = this.props;
        const { id } = shop;

        this.props.dispatch(getShopTerminals(id));
    }

    onSave = (data, afterOnSave) => {
        
        this.props.updateShop(data)
            .then(response => {
                afterOnSave(response)
            })

    }

    render () {

        const {
            lastModified
        } = this.props.shopReducer;

        const {
            terminals = {}
        } = this.props.companyReducer;

        return (
            <ShopInfoEditable
                dataToEdit={this.props.shop}
                onSave={this.onSave}
                lastModified={lastModified}
                terminals={terminals}
            />
        )
    }

}

const ShopSettingsWithTitle = ContainerWithTitle(ShopInfoContainer, 'Shop Information')

export default connect(({dispatch, authReducer, shopReducer, companyReducer}) => ({dispatch, authReducer, shopReducer, companyReducer}))(ShopSettingsWithUpdate(ShopSettingsWithTitle))