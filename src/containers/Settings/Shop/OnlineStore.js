import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { updateShop, getStoreKey, generateKey } from '../../../actions/shop';

// local components
import OnlineStore from '../../../components/Shops/OnlineStore';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import EditableHOCWrapper from '../../HOC/EditableHOC';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate'
import { fetchInventories } from '../../../actions/inventory';

const OnlineStoreEditable = EditableHOCWrapper(OnlineStore)

class OnlineStoreContainer extends PureComponent {

    componentDidMount () {

        const {
            shop = {}
        } = this.props;

        this.props.dispatch(fetchInventories(shop.id))
        this.props.dispatch(getStoreKey())

    }
    
    onSave = (data, afterOnSave) => {

        const {
            shop
        } = this.props;

        const newShop = {
            ...shop,
            onlineStoreInfo: data
        }
        
        this.props.dispatch(updateShop({...newShop}))
            .then(response => {
                afterOnSave(response)
            })

    }

    generateKey = () => {
        this.props.dispatch(generateKey())
    }

    render () {

        const {
            currentStoreKey = {},
            lastModified = null
        } = this.props.shopReducer;

        const {
            inventories = {}
        } = this.props.inventoryReducer;

        const {
            shop
        } = this.props;

        const {
            onlineStoreInfo
        } = shop;

        if(onlineStoreInfo && onlineStoreInfo.validateInventory == "None"){
            onlineStoreInfo.validateInventory = "ByInventory"
        }

        const inventoriesValues = inventories.values || [];

        return (
            <OnlineStoreEditable
                currentStoreKey={currentStoreKey}
                shop={shop}
                dataToEdit={onlineStoreInfo}
                onSave={this.onSave}
                lastModified={lastModified}
                inventories={inventoriesValues.filter(inventory => inventory.active)}
                generateKey={this.generateKey}
            />
        )
    }

}

const OnlineStoreWithTitle = ContainerWithTitle(OnlineStoreContainer, 'Online Store')

export default connect(({dispatch, shopReducer, inventoryReducer}) => ({dispatch, shopReducer, inventoryReducer}))(ShopSettingsWithUpdate(OnlineStoreWithTitle));