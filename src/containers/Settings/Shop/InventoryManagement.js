import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

// actions
import { fetchInventories, updateInventory, addNewInventory, deleteInventory } from '../../../actions/inventory';
import { openErrorMessage, openSuccessMessage } from '../../../actions/message';

// utils
import { sortInventories } from '../../../utils/array';
import { hasAccess } from '../../../utils/api';

// local components
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import InventoryItemContainer from '../../../components/Inventory/InventoryItemContainer';
import ModalDialog from '../../../components/common/ModalDialog';
import { getCompanyFeatures, getRegions } from '../../../actions/company';
import { Appcues } from '../../../utils/constants';
import { complianceSync, getComplianceInventoryRooms } from '../../../actions/compliance';
import { getMetrcLocationTypes } from '../../../actions/thirdParty';
import { getComplianceInventoryRoomsDisplayData } from '../../../utils/compliance';

const emptyInventory = {
    name: '',
    accountType: 'None',
    username: '',
    password: '',
    numTerminals: 0,
    active: true,
    regionIds: []
}

class InventoryManagement extends PureComponent {

    state = {
        showEmptyInventory: false,
        selectedToDeleteInventory: {},
        complianceRoomOptions: [],
    }

    componentDidMount () {
        let complianceType = this.props.authReducer.session.assignedShop.complianceType || ""
        let { facilityAccount = {} } = this.props.authReducer.session.assignedShop 
        this.props.dispatch(getRegions());
        this.props.dispatch(fetchInventories())
        this.props.dispatch(getCompanyFeatures());
        if(complianceType === "BIOTRACK" || complianceType === "METRC" && facilityAccount && facilityAccount.enablePackageLocationTracking){
            this.props.dispatch(getComplianceInventoryRooms()).then(
                res =>  this.setState({
                    complianceRoomOptions: getComplianceInventoryRoomsDisplayData(complianceType,res) || []
                })
            )
            //this.props.dispatch(getMetrcLocationTypes())
        }
    }

    onInventoryUpdate = (data, afterOnSave) => {
        if(this.validateInventory(data)) {
            this.props.dispatch(updateInventory(data))
            .then(response => {
                Appcues.track('Inventory Updated')
                this.props.dispatch(fetchInventories())
                afterOnSave(response)
            })
        }

    }

    openDeleteModal = inventory => e => {

        this.setState({
            selectedToDeleteInventory: inventory
        })

        this.deleteModal.handleClickOpen();

    }

    onDeleteInventory = inventory => e => {

        this.deleteModal.handleClose();

        this.props.dispatch(deleteInventory(inventory.id))
            .then(response => {
                Appcues.track('Inventory deleted')
                this.props.dispatch(fetchInventories())
            })

    }

    toggleEmptyInventory = () => {
        Appcues.track('Adding Inventory')
        this.setState(
            prevState => (
                {
                    showEmptyInventory: !prevState.showEmptyInventory
                }
            )
        )
    }
    
    addNewInventory = (data, afterOnSave) => {

        const {
            session = {}
        } = this.props.authReducer;

        const { assignedShop = {} } = session;

        if(this.validateInventory(data)) {
            this.props.dispatch(addNewInventory({...data, shopId: assignedShop.id}))
            .then(inventory => {
                Appcues.track('Added New Inventory')
                this.props.dispatch(fetchInventories())
                this.toggleEmptyInventory()
            })
        }
    }

    validateInventory = (inventory) => {
        if(!inventory.name || !inventory.name.trim()) {
            this.props.dispatch(openErrorMessage('Please enter inventory name'));
            return false;
        }

        return true;
    }

    syncInventoryRooms = async () => {
        const syncType = ["SYNC_INVENTORY_ROOMS"]
        let res = await this.props.dispatch(complianceSync(syncType))
        this.props.dispatch(openSuccessMessage('Sync has been started successfully!'))
    }

    render () {

        const {
            inventories = {},
            lastModified = null
        } = this.props.inventoryReducer;

        const { regions={} ,companyFeatures} = this.props.companyReducer;
        const { assignedShop = {} } = this.props.authReducer.session
        const { facilityAccount = {}, complianceType = "" } = assignedShop;
        const { metrcLocationTypes = [] } = this.props.thirdPartyReducer;
        const {
            showEmptyInventory,
            selectedToDeleteInventory
        } = this.state;

        const isComplianceRoomsEnabled = complianceType === "BIOTRACK" || complianceType === "METRC" && facilityAccount && facilityAccount.enablePackageLocationTracking 

        const inventoriesValues = sortInventories(inventories.values || []);
        return (
            <Grid container>
                {hasAccess() ? <Grid item xs={12} sm={12} md={12} lg={12}>
                    {assignedShop.complianceType === "BIOTRACK" ? <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={this.syncInventoryRooms}>Sync Inventory Rooms</Button> : null}
                    <Button variant="raised" className="primary-button pull-right margin-bottom-small margin-right-small" onClick={this.toggleEmptyInventory}>Add Inventory</Button>
                </Grid> : <Grid item xs={12} sm={12} md={12} lg={12}/>}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {/* <div className="table-scroll cus-pager-top"> */}
                    <div className="table cus-pager-top">
                        {/* <Paper> */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Inventory Id</TableCell>
                                        <TableCell>Inventory Name</TableCell>
                                        <TableCell>Regions</TableCell>
                                        {isComplianceRoomsEnabled ? <TableCell>Compliance Room</TableCell> : null}
                                        <TableCell># Terminals</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        showEmptyInventory ?
                                            <InventoryItemContainer
                                                complianceType={assignedShop.complianceType}
                                                complianceRoomOptions={this.state.complianceRoomOptions}
                                                isComplianceRoomsEnabled={isComplianceRoomsEnabled}
                                                inventory={emptyInventory}
                                                lastModified={lastModified}
                                                onInventoryUpdate={this.addNewInventory}
                                                onCancel={this.toggleEmptyInventory}
                                                defaultEditMode={true}
                                                regions={(regions && regions.values) || []}
                                                companyFeatures={(companyFeatures)}
                                            />
                                        : null
                                    }
                                    {
                                        inventoriesValues.map(
                                            (row, index) => {
                                                return <InventoryItemContainer
                                                    complianceType={assignedShop.complianceType}
                                                    complianceRoomOptions={this.state.complianceRoomOptions}
                                                    isComplianceRoomsEnabled={isComplianceRoomsEnabled}
                                                    key={index}
                                                    inventory={row}
                                                    lastModified={lastModified}
                                                    onInventoryUpdate={this.onInventoryUpdate}
                                                    onDelete={this.openDeleteModal(row)}
                                                    regions={(regions && regions.values) || []}
                                                    companyFeatures={(companyFeatures)}
                                                />
                                            }
                                        )
                                    }
                                </TableBody>
                            </Table>
                        {/* </Paper> */}
                    </div>
                </Grid>
                <ModalDialog
                    ref={c => this.deleteModal = c}
                    onConfirm={this.onDeleteInventory(selectedToDeleteInventory)}
                    confirmText="delete"
                >
                    Are you sure you want to delete '{selectedToDeleteInventory.name}'?
                </ModalDialog>
            </Grid>
        )
    }

}

export default connect(
    ({
        dispatch,
        authReducer,
        inventoryReducer,
        companyReducer,
        companyFeatures,
        thirdPartyReducer
    }) => ({
        dispatch,
        authReducer,
        inventoryReducer,
        companyReducer,
        companyFeatures,
        thirdPartyReducer
    })
)(ContainerWithTitle(InventoryManagement, 'Inventories'));