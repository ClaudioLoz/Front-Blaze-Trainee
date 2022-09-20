import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Grid, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from '@material-ui/core';

// api
import { uploadAssetAPI } from '../../../api/assets';

// actions
import { openErrorMessage } from '../../../actions/message';
import { updateShop } from '../../../actions/shop';

// utils
import { getAssetType } from '../../../utils/Image';
import { addMessageCurry, createGetUrl , hasAccess } from '../../../utils/api';
import { toLocalDate } from '../../../utils/common';

// local components
import ContainerWithTitleWrapper from '../../HOC/ContainerWithTitle';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import ModalDialog from '../../../components/common/ModalDialog';
import { Appcues } from '../../../utils/constants';


class ShopDocuments extends Component {

    state = {
        open: false,
        selectedAsset: {}
    }

    openUploader = () => {
        Appcues.track('Adding Document')
        this.setState({
            open: true
        })

    }

    closeUploader = () => {
        
        this.setState({
            open: false
        })

    }

    onUpload = (file) => {
        Appcues.track('Uploading Document')

        this.closeUploader();

        const type = getAssetType(file.name);

        addMessageCurry(uploadAssetAPI(file, type), this.props.dispatch)
            .then(photo => {

                const { shop } = this.props;
                const newShop = {...shop, assets: [...shop.assets, photo]};
                
                this.props.dispatch(updateShop(newShop))

            })
    }

    onError = error => {

        this.props.dispatch(openErrorMessage(error))

    }

    openDeleteModal = asset => e => {
        Appcues.track('Dleting document ')
        this.setState({
            selectedAsset: asset
        })

        this.deleteModal.handleClickOpen();

    }

    openViewModal = asset => e => {

        this.setState({
            selectedAsset: asset
        })

        this.viewModal.handleClickOpen();

    }

    onDeleteAsset = asset => e => {
        Appcues.track('Document Removed')

        this.deleteModal.handleClose();

        const { shop } = this.props;

        let assetsCopy = [...shop.assets];

        const assetIndex = assetsCopy.findIndex(shopAsset => shopAsset.id === asset.id);

        assetsCopy.splice(assetIndex, 1);
        
        const newShop = {...shop, assets: assetsCopy}

        this.props.dispatch(updateShop(newShop))

    }

    
    render () {

        const {
            shop
        } = this.props;

        const { assets = [] } = shop;

        const {
            selectedAsset = {}
        } = this.state;

        return (
            <Grid container>
                {hasAccess() ? <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={this.openUploader}>Add Document</Button>
                </Grid> : <Grid item xs={12} sm={12} md={12} lg={12}/>}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div className="table-scroll cus-pager-top">
                        { assets.length ? <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date Updated</TableCell>
                                        <TableCell>File Name</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        assets.map(
                                            (asset, index) => <TableRow key={index}>
                                                <TableCell>{toLocalDate(asset.created)}</TableCell>
                                                <TableCell>{asset.name}</TableCell>
                                                <TableCell>
                                                    <Button className="primary-button margin" onClick={this.openViewModal(asset)}>View</Button>
                                                   {hasAccess() ? <Button className="danger-button margin" onClick={this.openDeleteModal(asset)}>Remove</Button> : null}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </Paper> : <h1>No documents uploaded</h1> }
                    </div>
                </Grid>
                <ModalDialog
                    ref={c => this.deleteModal = c}
                    onConfirm={this.onDeleteAsset(selectedAsset)}
                    confirmText="delete"
                >
                    Are you sure you want to delete '{selectedAsset.name}'
                </ModalDialog>
                <ModalDialog
                    ref={c => this.viewModal = c}
                    hideSave
                >
                    <object data={createGetUrl(selectedAsset.key)} type="application/pdf" style={{width: '100%', height: 700}}>
                        Document could not be loaded
                    </object>
                </ModalDialog>
            </Grid>
        )

    }

}

const ShopDocumentsWithTitle = ContainerWithTitleWrapper(ShopDocuments, 'Shop Documents')

export default connect(
    ({
        dispatch,
        shopReducer
    }) => ({
        dispatch,
        shopReducer
    })
)(ShopSettingsWithUpdate(ShopDocumentsWithTitle));