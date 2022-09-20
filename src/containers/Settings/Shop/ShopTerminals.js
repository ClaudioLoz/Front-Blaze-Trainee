import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

// actions
import { updateTerminal, addNewTerminal, deleteTerminal, getCompanyFeatures, getRegions, getRegionsByTerminal } from '../../../actions/company';
import { fetchInventories, loadBrands } from '../../../actions/inventory';
import { getShopList, getShopTerminals } from '../../../actions/shop';
import { openErrorMessage } from '../../../actions/message';
import { getThirdPartyAccounts } from '../../../actions/thirdParty';

// utils
import { sortArrayByName } from '../../../utils/array';
import { hasAccess } from '../../../utils/api';

// local components
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import ShopTerminalItemContainer from '../../../components/Terminals/ShopTerminalItemContainer';
import ModalDialog from '../../../components/common/ModalDialog';
import { Appcues } from '../../../utils/constants';

import { getPosTerminals } from '../../../actions/dejavoo';



const emptyTerminal = {
    id: '',
    name: '',
    enabled: false,
    shopId: '',
    assignedInventoryId: '',
    checkoutType: '',
    deviceName: '',
    posTerminal: '',
    active: true
}

class ShopTerminals extends PureComponent {

    state = {
        showEmptyTerminal: false,
        selectedToDeleteTerminal: {},
        posTerminals: [],
        validationList: []
    }

    initialLoad = () => {
        const { shop } = this.props;
        const { id } = shop;
        // this.props.dispatch(getRegions());
        this.props.dispatch(getRegionsByTerminal());
        this.props.dispatch(getShopTerminals(id)).then(res => {
            this.setState({ validationList: res && res.values || [] });
        });
    }

    componentDidMount() {

        const { shop } = this.props;
        const { id } = shop;

        this.initialLoad();
        this.props.dispatch(fetchInventories(id));
        this.props.dispatch(getThirdPartyAccounts());
        this.props.dispatch(getShopList());
        this.props.dispatch(getCompanyFeatures());
        this.props.dispatch(loadBrands({start:0, limit: 0}));

        const session = this.props.authReducer.session
        if (session && session.assignedShop
            && session.assignedShop.paymentOptions
            && session.assignedShop.paymentOptions.length > 0) {
            var blazePayPermission = session.assignedShop.paymentOptions.find(po => po.paymentOption === 'BlazePay');
            if (blazePayPermission && blazePayPermission.enabled) {
                this.props.dispatch(getPosTerminals())
                    .then(response => {
                        this.setState({
                            posTerminals: response
                        });
                    })
            }
        }

    }

    onTerminalUpdate = (data, afterOnSave) => {
        if (this.validateTerminal(data)) {
            this.props.dispatch(updateTerminal(data))
                .then(response => {
                    Appcues.track('Updated Shop Terminal')
                    this.props.dispatch(this.initialLoad)
                    afterOnSave(response)
                })
        }

    }

    openDeleteModal = terminal => e => {

        this.setState({
            selectedToDeleteTerminal: terminal
        })

        this.deleteModal.handleClickOpen();

    }

    onDeleteTerminal = terminal => e => {

        this.deleteModal.handleClose();

        this.props.dispatch(deleteTerminal(terminal.id))
            .then(response => {
                Appcues.track('Shop Terminal Deleted')
                this.props.dispatch(this.initialLoad)
            })

    }

    toogleEmptyTerminal = () => {
        Appcues.track('Adding Shop Terminal')
        this.setState(
            prevState => (
                {
                    showEmptyTerminal: !prevState.showEmptyTerminal
                }
            )
        )
    }

    addNewTerminal = (data, afterOnSave) => {
        if (this.validateTerminal(data) && this.validateCheckoutType(data)) {
            this.props.dispatch(addNewTerminal(data))
                .then(terminal => {
                    Appcues.track('Added New Shop Terminal')
                    this.props.dispatch(this.initialLoad)
                    this.toogleEmptyTerminal()
                })
        }
    }

    validateTerminal = (terminal) => {
        if (!terminal.name) {
            this.props.dispatch(openErrorMessage('Please enter terminal name'));
            return false;
        }
        return true;
    }

    validateCheckoutType = (terminal) => {
        if (!terminal && !terminal.checkoutType) {
            this.props.dispatch(openErrorMessage('Please select Checkout Type'));
            return false;
        }
        return true;
    }

    refreshValidationList = (terminalId, key, value) => {
        const currentTerminals = this.state.validationList.map(terminal => {
            if (terminal.id == terminalId) {
                terminal[key] = value;
            }
            return terminal;
        })

        this.setState({ validationList: currentTerminals || [] });
    }

    getBlazePayPermissions = (assignedShop) => {
        if (assignedShop
            && assignedShop.paymentOptions
            && assignedShop.paymentOptions.length > 0) {
            return assignedShop.paymentOptions.find(po => po.paymentOption === 'BlazePay');
        }
        return null;
    }

    render() {
    
        const { session = {} } = this.props.authReducer;
        emptyTerminal.checkoutType = session.assignedShop && session.assignedShop.checkoutType;
        const { assignedShop = {} } = session || {};
        var blazePayPermission = this.getBlazePayPermissions(assignedShop);
        const {
            inventories = {}
        } = this.props.inventoryReducer;

        const {
            terminals = {},
            lastModified = null,
            companyFeatures
        } = this.props.companyReducer;

        const {
            thirdPartyAccounts = {}
        } = this.props.thirdPartyReducer;

        const {
            showEmptyTerminal,
            selectedToDeleteTerminal,
            posTerminals,
            validationList = []
        } = this.state;

        const terminalsValues = sortArrayByName(terminals.values || []);
        const inventoryValues = inventories.values || [];
        const thirdPartyAccountsValues = thirdPartyAccounts.values || [];

        const activeInventories = inventoryValues.filter(inventory => inventory.active)

        const permitted = hasAccess()

        const { availableApps = [] } = companyFeatures;

        const blazeEventsEnabled = this.props.companyReducer && this.props.companyReducer.companyFeatures && this.props.companyReducer.companyFeatures.blazeEvent;
        
        return (
            <div>
                <Grid container>
                    {permitted ? <Grid className="addButton" item xs={12} sm={12} md={12} lg={12}>
                        <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={this.toogleEmptyTerminal}>Add Terminal</Button>
                    </Grid> : <Grid className="addButton" item xs={12} sm={12} md={12} lg={12} />}
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div className="table cus-pager-top">
                            <Paper>
                                <Table className="cell-padd-remove">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tab-id">ID</TableCell>
                                            <TableCell>Terminal Name</TableCell>
                                            <TableCell>Device Name</TableCell>
                                            {availableApps.length > 0 && availableApps && availableApps.indexOf("Dispatch") >= 0 ? <TableCell>Region</TableCell> : null}
                                            <TableCell>Assigned Inventory</TableCell>
                                            {/* <TableCell>Assigned Cash Vault</TableCell> */}
                                            <TableCell>Checkout Type</TableCell>
                                            {blazePayPermission && blazePayPermission.enabled ? <TableCell>POS Terminal</TableCell> : null}
                                            {blazeEventsEnabled ? <TableCell>Brands</TableCell> : null }
                                            <TableCell>Status</TableCell>
                                            {permitted ? <TableCell></TableCell> : null}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            showEmptyTerminal ?
                                                <ShopTerminalItemContainer
                                                    terminal={emptyTerminal}
                                                    lastModified={lastModified}
                                                    onTerminalUpdate={this.addNewTerminal}
                                                    inventories={activeInventories}
                                                    onCancel={this.toogleEmptyTerminal}
                                                    thirdPartyAccounts={thirdPartyAccountsValues}
                                                    defaultEditMode={true}
                                                    blazePayPermission={blazePayPermission}
                                                    posTerminals={posTerminals}
                                                    refreshValidationList={this.refreshValidationList}
                                                    validationList={validationList}
                                                />
                                                : null
                                        }
                                        {
                                            terminalsValues.map(
                                                (row, index) => {
                                                    return <ShopTerminalItemContainer
                                                        key={index}
                                                        terminal={row}
                                                        lastModified={lastModified}
                                                        onTerminalUpdate={this.onTerminalUpdate}
                                                        inventories={activeInventories}
                                                        thirdPartyAccounts={thirdPartyAccountsValues}
                                                        onDelete={this.openDeleteModal(row)}
                                                        permitted={permitted}
                                                        blazePayPermission={blazePayPermission}
                                                        posTerminals={posTerminals}
                                                        refreshValidationList={this.refreshValidationList}
                                                        validationList={validationList}
                                                    />
                                                }
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </div>
                    </Grid>
                    <ModalDialog
                        ref={c => this.deleteModal = c}
                        onConfirm={this.onDeleteTerminal(selectedToDeleteTerminal)}
                        confirmText="delete"
                    >
                        Are you sure you want to delete '{selectedToDeleteTerminal.name}'?
                    </ModalDialog>
                </Grid>
            </div>
        )
    }

}

export default connect(
    ({
        dispatch,
        shopReducer,
        companyReducer,
        inventoryReducer,
        thirdPartyReducer,
        authReducer
    }) => ({
        dispatch,
        shopReducer,
        companyReducer,
        inventoryReducer,
        thirdPartyReducer,
        authReducer
    })
)(ShopSettingsWithUpdate(ContainerWithTitle(ShopTerminals, 'Shop Terminals')));