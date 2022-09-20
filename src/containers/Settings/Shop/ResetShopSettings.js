import React, { PureComponent } from 'react';
import {
    Grid    
} from '@material-ui/core';
import { connect } from 'react-redux';

import { resetProducts, resetProductStock } from '../../../actions/shop';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import ResetSettings from '../../../components/ResetSettings';

class ResetShopSettings extends PureComponent {

    deleteProducts = (password) => {
        return this.props.dispatch(resetProducts(password))
    }

    resetStock = (password) => {
       //
        return this.props.dispatch(resetProductStock(password))
    }

    render () {
        
        const resetData = [
            {
                title: 'Reset Product Stock',
                info: 'Resetting product stock will keep your existing products but clear/reset all associated inventory quantities.',
                modalInfo: 'Do you want to reset all products stock?',
                onConfirm: this.resetStock,
                confirmText: "Reset",
                buttonTitle: 'Reset All Product Stock'
            },
            {
                title: 'Delete All Products',
                info: 'Deleting Products will delete all products for your current shop including their associated inventory quanitites.',
                modalInfo: 'Do you want to delete all Products?',
                onConfirm: this.deleteProducts,
                confirmText: "Delete",
                buttonTitle: 'Delete Products'
            }
        ]

        return (
            <Grid container>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="center" alignItems="center" alignContent="center">
                   <p>WARNING!!  Resetting your data will completely delete all data points.</p>
                </Grid>
                {
                    resetData && resetData.length && resetData.map((data, index) => {
                        return <ResetSettings
                            {...data}
                            key={index}
                        />
                    })
                }
            </Grid>
        )
    }

}
export default connect((state) =>({
    dispatch: state.dispatch
}))(ShopSettingsWithUpdate(ContainerWithTitle(ResetShopSettings, 'Reset Shop Settings')));