import React, { PureComponent, Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Paper, ListItem, Grid, Checkbox, MenuItem, Button, FormControlLabel, Tooltip, withStyles, Typography } from '@material-ui/core';

// constants
import { Appcues } from '../../utils/constants';

// utils
import { hasAccess } from '../../utils/api';

// local components
import EditActionComponent from '../common/EditActionComponent';

import { EditableTextField, EditableSelect, EditableSwitch, EditableTextArea } from '../common/EditableComponents';
import { EditableColorPicker, ColorSwatch } from '../common/ColorPicker';
import { toCurrencyLocale } from '../../utils/common';
import config from '../../config/config';
import InfoIcon from '@material-ui/icons/Info';
import { updateShop } from '../../actions/shop';
import { connect } from 'react-redux';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}))(Tooltip);

const minimumTypes = [
    {
        value: 'SubtotalWithDiscount',
        label: 'Subtotal with discounts'
    },
    {
        value: 'Subtotal',
        label: 'Subtotal Only'
    }
]

const etaList = [
    {
        value: 5,
        label: "Within 5 minutes"
    }, {
        value: 10,
        label: "Between 5 to 10 min"
    }, {
        value: 20,
        label: "Between 10 to 20 min"
    }, {
        value: 30,
        label: "Between 15 to 30 min"
    }, {
        value: 60,
        label: "Between 30 min to 1 hr"
    }, {
        value: 90,
        label: "Between 1 hr to 1.5hr"
    }, {
        value: 120,
        label: "Between 1 to 2 hrs"
    }, {
        value: 180,
        label: "Between 2 to 3 hrs"
    }, {
        value: 300,
        label: "Between 3 to 5 hrs"
    }
]

class OnlineStore extends PureComponent {

    state = {
        codePreviewOpen: false,
        copied: false,
        dataShop: {},
        validateInventoryOptions : [
            { value: "ByInventory", name: "By Inventory", tooltip: "Online store displays only products from either all inventories or a single specified inventory to all customers." },
            { value: "ByNearbyRegion", name: "By Nearby Region", tooltip: "Online store displays products from the inventories assigned to a region that the customer’s online store account address matches. If there is no matching address, the online store displays all products." },
            { value: "ByNearbyRegionAndDefault", name: "By Nearby Region + Default Region", tooltip: "Online store displays products from the inventories assigned to a region that the customer’s online store account address matches. If there is no matching address, the online store displays products from the inventory assigned to the default region."}
        ]
    }

    componentDidMount() {
        const { shop = {}, } = this.props;
        this.setState({dataShop: shop})
    }

    onChange = (key, isCheckBox) => e => {

        const value = isCheckBox ? e.target.checked : e.target.value;

        this.props.onChange(key, value)

    }

    onChangeAddress = key => e => {

        const { data } = this.props;
        const { address } = data;

        let newAddress = { ...address }

        newAddress = {
            ...newAddress,
            [key]: e.target.value
        }

        this.props.onChange('address', newAddress)

    }

    onChangeAvailableAreas = e => {

        const zipString = e.target.value;
        let restrictedZipCodes = [];

        if (zipString === "") {
            restrictedZipCodes = [];
        }

        let zipArray = zipString.split(',');

        for (var zip in zipArray) {
            restrictedZipCodes.push(zipArray[zip].trim());
        }

        this.props.onChange('restrictedZipCodes', restrictedZipCodes)
    }

    onChangeActiveInventory = e => {

        let enableInventoryType = 'Custom'
        if (e.target.value === '') {
            enableInventoryType = 'All'
        }

        this.props.onChange('enableInventoryType', enableInventoryType)
        this.props.onChange('activeInventoryId', e.target.value)
    }

    onChangeIncomingOrders = (key, isCheckBox) => e => { 

        const {dataShop={}} = this.state;
        const value = isCheckBox ? e.target.checked : e.target.value;
        const dataUpdated = {...dataShop, [key]: value}
        let updatedDataShop = {...dataUpdated}
        this.setState({dataShop: updatedDataShop});

    }

    onChangeValidateInventory = e => {
        this.props.onChange("validateInventory", e.target.value)
    }

    getValidateInventoryName = data => {
        if(data.enableInventory){
            switch(data.validateInventory){
                case "ByInventory":
                case "None":
                    return "By Inventory";
                case "ByNearbyRegion":
                    return "By Nearby Region";
                case "ByNearbyRegionAndDefault":
                    return "By Nearby Region + Default Region"
                default:
                    return "";
            }  
        }
        return "Disabled";
    }

    getValidateInventoryTooltip = data => {
        if (data.enableInventory) {
            var selectedOption = this.state.validateInventoryOptions.find(option => option.value == data.validateInventory);

            return selectedOption ? selectedOption.tooltip : "Disables the Validate Inventory Availability setting";
        }
        return "Disables the Validate Inventory Availability setting";
    }

    onColorChange = key => color => {

        this.props.onChange(key, color.hex)

    }

    onSave = () => {
        const { dataShop = {}} = this.state
        Appcues.track('Online Store settings saved')
        this.props.onSave(response => this.props.disableEdit())
        this.props.dispatch(updateShop(dataShop))
        .then(res => {
            this.setState({
                dataShop: res
            })
        });
    }

    onCancel = () => {

        this.props.onCancel()

    }

    toggleView = () => {

        this.setState(
            prevState => ({
                codePreviewOpen: !prevState.codePreviewOpen
            })
        )

    }

    render() {

        const {
            editMode = false,
            inventories = [],
            currentStoreKey = {},
            shop = {},
            data = {},
            generateKey
        } = this.props

        const {
            codePreviewOpen,
            validateInventoryOptions,
            dataShop = {}
        } = this.state;

        const selectedMinimumType = minimumTypes.find(type => type.value === data.cartMinType) || minimumTypes[0];
        const selectedInventory = inventories.find(inventory => inventory.id === data.activeInventoryId) || {};
        const selectedEta = etaList.find(type => type.value === data.defaultETA) || etaList[0];

        let widgetWebsiteURL = config.storeWidgetURL;

        let codeSnippet = shop.appTarget === 'Distribution' ? `<iframe id="blazeIframe" frameborder="0" src="${config.storeFrontURL}" height="100%" width="100%"></iframe><script>var blazeUrl="${config.storeFrontURL}"; var apiKey="${currentStoreKey.key}";var script=document.createElement('script');script.src=blazeUrl+'/'+'widget.js';script.id='blazeIframeScript';script.setAttribute('blazeUrl',blazeUrl)
        script.setAttribute('apiKey',apiKey)
        document.head.appendChild(script);</script>` : `<iframe id="blazeIframe" frameborder="0" style></iframe><script>var blazeUrl="${widgetWebsiteURL}"; var apiKey="${currentStoreKey.key}";var script=document.createElement('script');script.src=blazeUrl+'/'+'widget.js';script.id='blazeIframeScript';script.setAttribute('blazeUrl',blazeUrl);
            script.setAttribute('apiKey',apiKey);
            document.head.appendChild(script);</script>`
        
        return (
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {hasAccess() ? <div className="pull-right margin-bottom-small">
                        <EditActionComponent
                            onSave={this.onSave}
                            onCancel={this.onCancel}
                            onEdit={this.props.enableEdit}
                            editMode={editMode}
                        />
                    </div> : <div className="pull-right margin-bottom-small" />}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Paper className="paper-page">
                        <ListItem>
                            <Grid container>
                                <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                    Enable Online Store
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <EditableSwitch
                                        valueToRender={data.enabled ? 'Enabled' : 'Disabled'}
                                        checked={data.enabled}
                                        editMode={editMode}
                                        onChange={this.onChange('enabled', true)}
                                    />
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className="paper-page">
                        <ListItem>
                            <Grid container>
                                <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                    Online Store Code
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <div className="full-width pull-left">
                                        <div className="code">{currentStoreKey.key}</div>
                                    </div>
                                    <div className="full-width pull-left margin-top-xs">
                                        {
                                            editMode ?
                                                <Fragment>
                                                    <Button className="primary-button" onClick={generateKey}>Generate</Button>
                                                    <Button className="primary-button margin" onClick={this.toggleView}>{codePreviewOpen ? 'Close' : 'View'}</Button>
                                                </Fragment>
                                                : null
                                        }
                                    </div>
                                    {
                                        codePreviewOpen ? <div className="full-width pull-left margin-top-xs">
                                            <div className="code">{codeSnippet}</div>
                                            <CopyToClipboard text={codeSnippet}
                                                onCopy={() => this.setState({ copied: true })}>
                                                <Button className="primary-button margin-top-xs">{this.state.copied ? 'Copied!' : 'Copy to clipboard'}</Button>
                                            </CopyToClipboard>
                                        </div> : null
                                    }
                                </Grid>
                            </Grid>
                        </ListItem>
                    </Paper>
                </Grid>
                {data.enabled ? <Fragment>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Paper className="paper-page">
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Website URL
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={data.websiteUrl}
                                            editMode={editMode}
                                            value={data.websiteUrl}
                                            onChange={this.onChange('websiteUrl')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </Paper>
                        <Paper className="paper-page">
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Enable HTML/JavaScript Text
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.enableHtmlText ? 'Enabled' : 'Disabled'}
                                            checked={data.enableHtmlText}
                                            editMode={editMode}
                                            onChange={this.onChange('enableHtmlText', true)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {data.enableHtmlText ? <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        HTML/JavaScript Text
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={data.htmlText}
                                            editMode={editMode}
                                            value={data.htmlText}
                                            onChange={this.onChange('htmlText')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem> : null}
                        </Paper>
                        <Paper className="paper-page">
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Custom CSS URL
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={data.customCss}
                                            editMode={editMode}
                                            value={data.customCss}
                                            onChange={this.onChange('customCss')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </Paper>
                        <Paper className="paper-page">
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Enable specific inventory
                                    </Grid>
                                    <Grid item xs={11} sm={5} md={5} lg={5}>
                                        <EditableSwitch
                                            valueToRender={data.enableInventory ? 'Enabled' : 'Disabled'}
                                            checked={data.enableInventory}
                                            editMode={editMode}
                                            onChange={this.onChange('enableInventory', true)}
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{display:'flex', alignItems:'center', justifyContent:'flex-end', fontSize:'14px'}}>
                                        {/* <Tooltip title={this.getValidateInventoryTooltip(data)} placement="top-start">
                                            
                                        </Tooltip> */}
                                        <HtmlTooltip
                                            placement="top-start"
                                            title={
                                                <React.Fragment>
                                                    <Typography color="inherit"><b>{this.getValidateInventoryName(data)}:</b> {this.getValidateInventoryTooltip(data)}</Typography>
                                                </React.Fragment>
                                            }
                                        >
                                            <InfoIcon style={{color:"#03a9f4"}} /> 
                                        </HtmlTooltip>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {
                                data.enableInventory && (
                                    <ListItem>
                                        <Grid container>
                                            <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                                Validate Inventory Availability
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                <EditableSelect
                                                    value={data.validateInventory || ''}
                                                    onChange={this.onChangeValidateInventory}
                                                    valueToRender={this.getValidateInventoryName(data)}
                                                    editMode={editMode}
                                                    displayEmpty
                                                >
                                                    {
                                                        validateInventoryOptions.map(
                                                            (item, index) => {
                                                                return <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                            }
                                                        )
                                                    }
                                                </EditableSelect>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                            }
                            {data.enableInventory && (data.validateInventory=="ByInventory" || data.validateInventory=="None")? <ListItem>
                                <Grid container>
                                    <Grid item className="labelField" xs={12} sm={6} md={6} lg={6}>
                                        Choose Inventory
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSelect
                                            value={data.activeInventoryId || ''}
                                            onChange={this.onChangeActiveInventory}
                                            valueToRender={!data.activeInventoryId ? 'All Inventories' : selectedInventory.name}
                                            editMode={editMode}
                                            displayEmpty
                                        >
                                            <MenuItem value="">All Inventories</MenuItem>
                                            {
                                                inventories.map(
                                                    (item, index) => {
                                                        return <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                    }
                                                )
                                            }
                                        </EditableSelect>
                                    </Grid>
                                </Grid>
                            </ListItem> : null}
                        </Paper>
                        <Paper className="paper-page">
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Enable Online POS
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.enableOnlinePOS ? 'Enabled' : 'Disabled'}
                                            checked={data.enableOnlinePOS}
                                            editMode={editMode}
                                            onChange={this.onChange('enableOnlinePOS', true)}
                                            disabled={shop.appTarget && shop.appTarget === 'Distribution' ? true : false}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Enable Incoming Orders
                                        </Grid>
                                        <Grid className="editField switch_btn" item xs={12} sm={2} md={2} lg={1}>
                                            <EditableSwitch
                                                valueToRender={dataShop.enableIncomingOrders ? 'Enabled' : 'Disabled'}
                                                checked={dataShop.enableIncomingOrders}
                                                editMode={editMode}
                                                onChange={this.onChangeIncomingOrders('enableIncomingOrders', true)}
                                            />
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={4} md={4} lg={5}>
                                            <span>When enabled, your shop can process incoming orders.</span>
                                        </Grid>
                                    </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Pick Up Method
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="pickup"
                                                    disabled={!editMode}
                                                    onChange={this.onChange('enableStorePickup', true)}
                                                    checked={data.enableStorePickup}
                                                />
                                            }
                                            label="Store Pick Up"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="delivery"
                                                    disabled={!editMode}
                                                    onChange={this.onChange('enableDelivery', true)}
                                                    checked={data.enableDelivery}
                                                />
                                            }
                                            label="Delivery"
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Color Theme
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableColorPicker
                                            valueToRender={<ColorSwatch color={data.storeHexColor || '#1cc4e8'} />}
                                            color={data.storeHexColor || '#1cc4e8'}
                                            onColorChange={this.onColorChange('storeHexColor')}
                                            editMode={editMode}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Cart Minimum Type
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSelect
                                            value={data.cartMinType}
                                            onChange={this.onChange('cartMinType')}
                                            valueToRender={selectedMinimumType.label}
                                            editMode={editMode}
                                        >
                                            {
                                                minimumTypes.map(
                                                    (item, index) => {
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                                    }
                                                )
                                            }
                                        </EditableSelect>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Cart Mininum
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={toCurrencyLocale(data.cartMinimum)}
                                            editMode={editMode}
                                            value={data.cartMinimum}
                                            onChange={this.onChange('cartMinimum')}
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Default Order ETA
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSelect
                                            value={data.defaultETA}
                                            onChange={this.onChange('defaultETA')}
                                            valueToRender={selectedEta.label}
                                            editMode={editMode}
                                        >
                                            {
                                                etaList.map(
                                                    (item, index) => {
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                                    }
                                                )
                                            }
                                        </EditableSelect>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Default View
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSelect
                                            value={data.viewType}
                                            onChange={this.onChange('viewType')}
                                            valueToRender={`${data.viewType} View`}
                                            editMode={editMode}
                                            displayEmpty
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            <MenuItem value="List">List View</MenuItem>
                                            <MenuItem value="Grid">Grid View</MenuItem>
                                        </EditableSelect>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Override ETA Message
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.useCustomETA ? 'Enabled' : 'Disabled'}
                                            checked={data.useCustomETA}
                                            editMode={editMode}
                                            onChange={this.onChange('useCustomETA', true)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {data.useCustomETA ? <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Custom ETA Message
                                    </Grid>
                                    <Grid className="cus_textarea" item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextArea
                                            valueToRender={data.customMessageETA}
                                            editMode={editMode}
                                            value={data.customMessageETA}
                                            onChange={this.onChange('customMessageETA')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem> : null}
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Account Setup Page 1 Message Title
                                    </Grid>
                                    <Grid className="cus_textarea" item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextArea
                                            valueToRender={data.pageOneMessageTitle}
                                            editMode={editMode}
                                            value={data.pageOneMessageTitle}
                                            onChange={this.onChange('pageOneMessageTitle')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Support Email
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={data.supportEmail}
                                            editMode={editMode}
                                            value={data.supportEmail}
                                            onChange={this.onChange('supportEmail')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Account Setup Page 1 Message
                                    </Grid>
                                    <Grid className="cus_textarea" item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextArea
                                            valueToRender={data.pageOneMessageBody}
                                            editMode={editMode}
                                            value={data.pageOneMessageBody}
                                            onChange={this.onChange('pageOneMessageBody')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Account Submission Success Message
                                    </Grid>
                                    <Grid className="cus_textarea" item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextArea
                                            valueToRender={data.submissionMessage}
                                            editMode={editMode}
                                            value={data.submissionMessage}
                                            onChange={this.onChange('submissionMessage')}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Enable Area restrictions
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.enableDeliveryAreaRestrictions ? 'Enabled' : 'Disabled'}
                                            checked={data.enableDeliveryAreaRestrictions}
                                            editMode={editMode}
                                            onChange={this.onChange('enableDeliveryAreaRestrictions', true)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            {data.enableDeliveryAreaRestrictions ? <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Available Areas
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableTextField
                                            valueToRender={!data.restrictedZipCodes ? '' : data.restrictedZipCodes.join(', ')}
                                            editMode={editMode}
                                            value={data.restrictedZipCodes}
                                            onChange={this.onChangeAvailableAreas}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem> : null}
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Show Other Marketing Source on Signup
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.enableOtherMarketingSource ? 'Enabled' : 'Disabled'}
                                            editMode={editMode}
                                            checked={data.enableOtherMarketingSource}
                                            onChange={this.onChange('enableOtherMarketingSource', true)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                        Deny Banned Customer Transactions
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <EditableSwitch
                                            valueToRender={data.denyBannedCustomers ? 'Enabled' : 'Disabled'}
                                            checked={data.denyBannedCustomers}
                                            editMode={editMode}
                                            onChange={this.onChange('denyBannedCustomers', true)}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </Paper>
                    </Grid>
                </Fragment> : null}
            </Grid>
        )
    }

}

export default connect(({...state}) => ({ dispatch: state.dispatch}))(OnlineStore)