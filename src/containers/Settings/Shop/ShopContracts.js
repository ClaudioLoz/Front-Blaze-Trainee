import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { FormControlLabel, Checkbox, FormControl, InputLabel, Input, Grid, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@material-ui/core';

// actions
import { getContracts, updateShopContract, addShopContract } from '../../../actions/shop';

// utils
import { hasAccess } from '../../../utils/api';

// local components
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import ShopContractItemContainer from '../../../components/Shops/ShopContractItemContainer';
import ModalDialog from '../../../components/common/ModalDialog';
import { openErrorMessage } from '../../../actions/message';
import { uploadAssetAPI } from '../../../api/assets';
import { addMessageCurry } from '../../../utils/api';
import { Appcues } from '../../../utils/constants';

class ShopContracts extends PureComponent {

    state = {
        newContract: {
            contentType: 'TEXT',
            name: '',
            text: '',
            active: false,
            required: false
        }
    }

    componentDidMount () {

        this.props.dispatch(getContracts())

    }

    onShopContractUpdate = (data, afterOnSave) => {

        this.props.dispatch(updateShopContract(data))
            .then(response => {
                Appcues.track('Shop contract updated')
                this.props.dispatch(getContracts())
                afterOnSave(response)
            })

    }

    openAddContractModal = () => {
        Appcues.track('Adding shop contract')
        this.addShopContractModal.handleClickOpen()

    }

    onCloseContractModal = () => {

        this.setState({
            newContract: {
                contentType: 'TEXT',
                name: '',
                text: '',
                active: false,
                required: false
            }
        })

    }

    addShopContract = pdfFile => {

        this.addShopContractModal.handleClose()

        const {
            newContract
        } = this.state;

        this.props.dispatch(addShopContract(newContract))
            .then(contract => {
                Appcues.track('Shop contract added')
                this.props.dispatch(getContracts())
                this.addShopContractModal.handleClose()
            })
    }

    onNewContractChange = (key, isCheckBox) => e => {

        const { newContract } = this.state;

        const contractCopy = {...newContract, [key]: isCheckBox ? e.target.checked : e.target.value};

        this.setState({
            newContract: contractCopy
        })

    }

    openUploader = () => {

        this.setState({
            open: true
        })

    }

    closeUploader = () => {
        
        this.setState({
            open: false
        })

    }

    updatePDF = pdfFile => {

        const { newContract } = this.state;

        const contractCopy = {...newContract, pdfFile};

        this.setState({
            newContract: contractCopy
        })

    }

    onUpload = (file) => {
        Appcues.track('Uploading PDF')

        this.closeUploader()

        const type = 'document';

        addMessageCurry(uploadAssetAPI(file, type), this.props.dispatch)
            .then(contract => {                
                this.updatePDF(contract)
            })
    }

    onError = error => {

        this.props.dispatch(openErrorMessage(error))

    }

    render () {

        const {
            contracts = {},
            lastModified = null
        } = this.props.shopReducer;

        const {
            newContract = {}
        } = this.state;

        const shopContracts = contracts.values || [];
        const permitted = hasAccess() 

        return (
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {permitted ? 
                        <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={this.openAddContractModal}>Add Contract</Button> : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div className="table-scroll cus-pager-top cell-padd-remove">
                        <Paper>
                            <Table>
                                <TableHead>		
                                    <TableRow>
                                        <TableCell>Version Number</TableCell>
                                        <TableCell>Agreement Name</TableCell>
                                        <TableCell>Content Type</TableCell>
                                        <TableCell>Active</TableCell>
                                        <TableCell>Required</TableCell>
                                        <TableCell>Enable Witness Signature</TableCell>
                                        <TableCell>Enable Employee Signature</TableCell>
                                        <TableCell>Date Uploaded</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        shopContracts.map(
                                            (row, index) => {
                                                return <ShopContractItemContainer
                                                    key={index}
                                                    contract={row}
                                                    lastModified={lastModified}
                                                    onShopContractUpdate={this.onShopContractUpdate}
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
                    title={'Add Contract'}
                    ref={c => this.addShopContractModal = c}
                    onConfirm={this.addShopContract}
                    onClose={this.onCloseContractModal}
                >
                    <FormControl fullWidth className="margin-bottom-small">
                        <InputLabel>Contract Name *</InputLabel>
                        <Input
                            rows={3}
                            onChange={this.onNewContractChange('name')}
                            value={newContract.name}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth className="margin-bottom-small">
                        <InputLabel>Contract Type *</InputLabel>
                        <Select value={newContract.contentType} onChange={this.onNewContractChange('contentType')}>
                            <MenuItem value="TEXT">Text</MenuItem>
                            <MenuItem value="PDF">PDF</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        newContract.contentType === 'TEXT' ? <FormControl fullWidth>
                            <InputLabel>Agreement Text *</InputLabel>
                            <Input
                                multiline
                                rows={3}
                                onChange={this.onNewContractChange('text')}
                                value={newContract.text}
                                fullWidth
                            />
                        </FormControl> : <div className="center-aligned-child">
                            <Button className="primary-button" onClick={this.openUploader}>Upload PDF</Button>
                        </div>
                    }
                    <br />
                    <FormControlLabel
                        control={
                            <Checkbox checked={newContract.active} onChange={this.onNewContractChange('active', true)} />
                        }
                        label="Active"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={newContract.required} onChange={this.onNewContractChange('required', true)} />
                        }
                        label="Required"
                    />
                </ModalDialog>
            </Grid>
        )
    }

}

export default connect(
    ({
        dispatch,
        shopReducer,
        companyReducer
    }) => ({
        dispatch,
        shopReducer,
        companyReducer
    })
)(ContainerWithTitle(ShopContracts, 'Shops Contracts'));