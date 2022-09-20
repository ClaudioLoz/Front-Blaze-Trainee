import React, { PureComponent } from 'react';
import {
    Paper,
    Button,
    Grid    
} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';

import { fetchInventories } from '../../../actions/inventory';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import { openErrorMessage } from '../../../actions/message';
import { hasAccess } from '../../../utils/api';
import { Appcues } from '../../../utils/constants';

class POSettings extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            receivingInventoryId: (props.shop && props.shop.receivingInventoryId) || '',
            edit_mode: false
        };
    }

    componentDidMount() {
        const { shop={} } = this.props;
        this.props.dispatch(fetchInventories(shop.id));
    }

    enableEdit = () => {
        Appcues.track('Updating Purchase Order')
        const { shop={}, inventoryReducer={} } = this.props;
        const { inventories={} } = inventoryReducer;
        const { receivingInventoryId } = shop;

        this.setState({
            edit_mode: true
        });
        const receivingInventory = inventories && inventories.values && inventories.values.length && inventories.values.filter(inv => inv.active).find(inventory => inventory.id === receivingInventoryId);

        if(!receivingInventory) {
            this.setState({
                receivingInventoryId: ''
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            receivingInventoryId: event.target.value
        })
    }

    saveShop = () => {
        Appcues.track('Purchase Order saved')

        const { shop={} } = this.props;
        const { receivingInventoryId } = this.state;
        
        if(!receivingInventoryId) {
            return this.props.dispatch(openErrorMessage('Please select inventory'));
        }

        this.props.updateShop({ ...shop, receivingInventoryId: receivingInventoryId }).then(res => {
            this.setState({
                edit_mode: false
            })
        })
    }

    render () {
        
        const { inventoryReducer={} } = this.props;
        const { inventories={} } = inventoryReducer;
        const { receivingInventoryId='', edit_mode=false } = this.state;
        const { values=[] } = inventories || {};
        const receivingInventory = (values && values.length && values.find((inv) => inv.id === receivingInventoryId)) || {};
        
        return (
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                   {hasAccess() ? 
                        <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={edit_mode ? this.saveShop : this.enableEdit}>{edit_mode ? 'Save' : 'Edit'}</Button> : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Paper>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={12} sm={4} md={4}>
                                    <ListItemText className="txt-bold">Receiving Inventory</ListItemText>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8}>
                                    {edit_mode ? <Select className="select-width"
                                        onChange={this.handleChange}
                                        value={receivingInventoryId}
                                        autoWidth={true}
                                        displayEmpty={true}
                                    >

                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            values && values.length && values.filter((inventory) => inventory.active).map((inventory, index) => {
                                                return <MenuItem key={index} value={inventory.id}>{inventory.name}</MenuItem>
                                            })
                                        }
                                    </Select> : <ListItemText>{(receivingInventory && receivingInventory.name) || 'Not Specified'}</ListItemText>}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

}

export default connect((state) =>({
    dispatch: state.dispatch,
    inventoryReducer: state.inventoryReducer
}))(ShopSettingsWithUpdate(ContainerWithTitle(POSettings, 'Purchase Order')));