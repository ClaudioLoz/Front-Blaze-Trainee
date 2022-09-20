import React, { PureComponent } from 'react';

// local components
import ShopListItem from './ShopListItem';
import EditableHOCWrapper from '../../containers/HOC/EditableHOC';

const ShopListItemEditable = EditableHOCWrapper(ShopListItem)

class ShopListItemContainer extends PureComponent {

    onSave = (data, afterOnSave) => {
        const { shop } = this.props
        this.props.onShopUpdate(data, afterOnSave, shop && shop.active)

    }

    render () {

        const {
            shop = {},
            lastModified = null,
            shopTerminalsLength = 0
        } = this.props

        return (
            <ShopListItemEditable
                dataToEdit={shop}
                onSave={this.onSave}
                lastModified={lastModified}
                shopTerminalsLength={shopTerminalsLength}
            />
        )
    }

}

export default ShopListItemContainer;