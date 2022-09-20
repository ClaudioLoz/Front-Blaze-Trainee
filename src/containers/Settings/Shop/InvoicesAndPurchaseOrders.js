import React from 'react';
import {
    Grid
} from '@material-ui/core';
import { connect } from 'react-redux';
import InvoiceItem from '../../../components/InvoicesAndPurchaseOrders/InvoiceItem';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import { hasAccess } from '../../../utils/api';
import EditActionComponent from '../../../components/common/EditActionComponent';
import { getSalesOrderConfig, updateSalesOrderConfig } from '../../../actions/salesOrder';

class InvoicesAndPurchaseOrders extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            shop: props.shop || {},
            shopOrderSettings: {
                date: 10,
                approvalRequired: false
            }
        }
    }

    componentWillMount = () => {
        this.props.dispatch(getSalesOrderConfig("SALES_ORDERS")).then(res => {
            this.setState({
                shopOrderSettings: res
            })
        });
    }

    getShopSettings = () => {
    }


    onSave = () => {
        const { shop={} } = this.state;
        const shopSettingData = JSON.stringify(this.state.shopOrderSettings);

        this.props.dispatch(updateSalesOrderConfig(shopSettingData, "SALES_ORDERS")).then(res => {
            this.props.updateShop(shop).then(res => {
                this.toggleEdit();
            })
        });
    }
    
    toggleEdit = () => {
        this.setState((prevState) => ({
            editMode: !prevState.editMode
        }));
    }

    onCancel = () => {
        const { shop={} } = this.props;
        this.setState({
            shop
        })
        this.toggleEdit();
    }

    onChange = (key, value) => {
        this.setState((prevState) => ({
            shop: {
                ...prevState.shop,
                [key]: value
            }
        }));
    }

    onChangeShopSettings = (key, value) => {
        this.setState((prevState) => ({
            shopOrderSettings: {
                ...prevState.shopOrderSettings,
                [key]: value
            }
        }));
    }

    render(){

        //const { shop } = this.props;
        const { editMode, shop={}, shopOrderSettings } = this.state;
        return (
            <div>
                <Grid container>
                    <Grid className="editField" item xs={12} sm={12} md={12} lg={12}>
                        {hasAccess() ? <div className="pull-right margin-bottom-small">
                            <EditActionComponent
                                onSave={this.onSave}
                                onCancel={this.onCancel}
                                onEdit={this.toggleEdit}
                                editMode={editMode}
                            />
                        </div> : <div className="pull-right margin-bottom-small"></div>}
                    </Grid>
                </Grid>
                <InvoiceItem
                    title="Invoices"
                    onSave={this.onSave}
                    data={{...shop}}
                    isInvoice={true}
                    onChange={this.onChange}
                    onChangeShopSettings={this.onChangeShopSettings}
                    editMode={editMode}
                    isSales={false}
                    shopOrderSettings={shopOrderSettings}
                />
                <InvoiceItem
                    title="Purchase Orders"
                    onSave={this.onSave}
                    data={{...shop}}
                    isInvoice={false}
                    onChange={this.onChange}
                    onChangeShopSettings={this.onChangeShopSettings}
                    editMode={editMode}
                    isSales={false}
                    shopOrderSettings={shopOrderSettings}
                />
                <InvoiceItem
                    title="Sales Orders"
                    onSave={this.onSave}
                    data={{...shop}}
                    isInvoice={false}
                    onChange={this.onChange}
                    onChangeShopSettings={this.onChangeShopSettings}
                    editMode={editMode}
                    isSales={true}
                    shopOrderSettings={shopOrderSettings}
                />
            </div>
        )
    }
}

const InvoicesAndPurchaseOrdersWithTitle = ContainerWithTitle(InvoicesAndPurchaseOrders, 'Invoices And Purchase Orders')

export default connect(({dispatch, shopReducer, inventoryReducer}) => ({dispatch, shopReducer, inventoryReducer}))(ShopSettingsWithUpdate(InvoicesAndPurchaseOrdersWithTitle));