import React, { PureComponent } from 'react';
// local components
import ShopContractItem from './ShopContractItem';
import EditableHOCWrapper from '../../containers/HOC/EditableHOC';

const ShopContractItemEditable = EditableHOCWrapper(ShopContractItem)

class ShopContractItemContainer extends PureComponent {

    onSave = (data, afterOnSave) => {

        this.props.onShopContractUpdate(data, afterOnSave)

    }

    render () {

        const {
            contract = {},
            lastModified = null,
        } = this.props

        return (
            <ShopContractItemEditable
                dataToEdit={contract}
                onSave={this.onSave}
                lastModified={lastModified}
            />
        )
    }

}

export default ShopContractItemContainer;