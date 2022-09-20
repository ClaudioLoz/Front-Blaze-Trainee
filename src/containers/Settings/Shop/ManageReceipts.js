import React from 'react';
import {
    Grid,
    Paper,
    Tabs,
    Tab,
    Button,
    Typography,
    Input,
    FormControl
} from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    EditableSwitch
} from '../../../components/common/EditableComponents';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import ContainerWithTitle from '../../HOC/ContainerWithTitle';
import { hasAccess } from '../../../utils/api';
import { Appcues } from '../../../utils/constants';
import { EditableDraftEditor } from '../../../components/common/EditableComponents';
import RenderHTML from '../../../components/Editor/RenderHTML';
import { EditableImageUploader, ImagePreview } from '../../../components/common/ImageUploader';
import { uploadAssetAPI } from '../../../api/assets';

const fulfillmentOptions = {

    'enableShopLicenseNumber': "Shop's license number",

    'enableShopAddress': "Shop's address",

    'enableShopPhoneNo': "Shop's phone number",

    'enableLicenseeBusinessName': "Licensee's business name",

    'enableEmployeeName' : "Employee's name",

    'enableEmployeeFullLastName' : "Employee's last name",

    'enableEmployeeId': "Employee's ID",

    'enableDeliveryDriverName' : "Delivery driver's name",

    'enableDeliveryDriverFullLastName' : "Delivery driver's last name",

    'enableDeliveryDriverId': "Delivery driver's employee ID",

    'enablePreparedByEmployeeName' : "Prepared by's name",

    'enablePreparedByEmployeeFullLastName' : "Prepared by's last name",

    'enablePreparedByEmployeeId': "Prepared by's employee ID",
    
    'enableMemberName': "Member's name",

    'enableMemberFullLastName': "Member's last name",

    'enableMemberId': "Member's ID",

    'enableMemberAddress': "Member's address",

    'enableMemberDeliveryAddress': "Member's delivery address",

    'enableMemberPhoneNo': "Member's phone number",

    'enableMemberLoyaltyPoints' : "Member's loyalty points",

    'enableNotes' : "Member's notes",

    'enableOrderDateTime': "Order creation date and time",

    'enableOrderNotes' : "Order's notes",

    'enableIncludeItemInSKU': "Product's SKU",

    'enableBrand': "Product's brand",

    'enableItemDiscount' : "Product's discount",

    'enableItemDiscountNotes' : "Product's discount note",

    'enableExciseTaxAsItem' : "Excise tax",
    
    'enabledFreeText' : 'Custom text above sales details',

    'enabledBottomFreeText' : 'Custom text below sales details'

}

class ManageReceipts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'SALES',
            fulfillment : fulfillmentOptions,
            freeTexts: [],
            shop: props.shop || {}
        }
    }

    componentDidMount() {
        const { shop={} } = this.state;
        let { receiptInfo=[] } = shop;
        const freeTexts = (receiptInfo && receiptInfo.length && receiptInfo.map((receipt) => {
            return { enabledBottomFreeText: receipt.freeText, enabledFreeText: receipt.aboveFreeText, enableLicenseeBusinessName: receipt.licenseeBusinessName };
        })) || [];
        this.setState({
            freeTexts
        });
        const {address = {}} = shop;
        if(!receiptInfo) { //For new shops
            const enabledCAFields = (address && address.state==="CA") || false;
            receiptInfo = [
                {receiptType: 'SALES'},
                {receiptType: 'FULFILLMENT'},
                {
                    receiptType: 'DELIVERY',
                    enableOrderDateTime: enabledCAFields,
                    enableMemberName: enabledCAFields,
                    enableMemberFullLastName: enabledCAFields,
                    enableMemberId: enabledCAFields,
                    enableMemberAddress: enabledCAFields,
                    enableShopAddress: enabledCAFields,
                    enableEmployeeName: enabledCAFields,
                    enableEmployeeId: enabledCAFields,
                    enablePreparedByEmployeeId: enabledCAFields,
                    enableShopLicenseNumber: enabledCAFields
                }
            ];
        }else if (receiptInfo && receiptInfo.length === 2){ //For shop that doesnt have the delivery receipt
            const enabledCAFields = (address && address.state==="CA") || false;
            receiptInfo = [
                ...receiptInfo,
                {
                    receiptType: 'DELIVERY',
                    enableOrderDateTime: enabledCAFields,
                    enableMemberName: enabledCAFields,
                    enableMemberFullLastName: enabledCAFields,
                    enableMemberId: enabledCAFields,
                    enableMemberAddress: enabledCAFields,
                    enableShopAddress: enabledCAFields,
                    enableEmployeeName: enabledCAFields,
                    enableEmployeeId: enabledCAFields,
                    enablePreparedByEmployeeId: enabledCAFields,
                    enableShopLicenseNumber: enabledCAFields
                }
            ]
        }
        this.setState({
            shop: {...shop, receiptInfo:[...receiptInfo]}
        });
    }

    changeActiveTab = (event, value) => {
        this.setState({
            activeTab: value
        });
    }

    setOption = (event, index, key, receiptInfo) => {
        const { shop={} } = this.state;
        //const {  } = this.props;
        let updatedReceiptInfo = receiptInfo.slice(0);
        if(key === 'enabledBottomFreeText' && !event.target.checked) {
            this.setFreeText(index, '');
        }
        updatedReceiptInfo[index][key] = event.target.checked
        this.setState({
            shop: {...shop, receiptInfo:[...updatedReceiptInfo]}
        });
        /* let updatedOptions = this.state[activeTab].slice(0);
        updatedOptions[index].selected = event.target.value == "true" ? true : false;
        this.setState({
            [activeTab] : updatedOptions
        }); */
    }

    onEmailChange = (event, index, receiptInfo) => {
        const { shop={} } = this.state;
        let updatedReceiptInfo = receiptInfo.slice(0);
        updatedReceiptInfo[index]['emailMessage'] = event;
        this.setState({
            shop: {...shop, receiptInfo:[...updatedReceiptInfo]}
        });
    }

    uploadEmailAttachment = (file, type, url, index, receiptInfo) => {
        return new Promise((res, rej) => {
            uploadAssetAPI(file, 'photo/public').then(response => {
                const { shop={} } = this.state;
                let updatedReceiptInfo = receiptInfo.slice(0);
                updatedReceiptInfo[index]['emailAttachment'] = response;
                this.setState({
                    shop: {...shop, receiptInfo:[...updatedReceiptInfo]}
                });
                res(response);
            })
        })
    }

    onSave = () => {
        Appcues.track('Receipt settings saved')
        const { receiptInfo } = this.state.shop;
        const { freeTexts=[] } = this.state;
        const updatedReceiptInfo = receiptInfo && receiptInfo.length && receiptInfo.map((receipt, index) => {
            const freeText = (freeTexts[index] && freeTexts[index]['enabledBottomFreeText']) || '';
            const aboveFreeText = (freeTexts[index] && freeTexts[index]['enabledFreeText']) || '';
            const licenseeBusinessName = (freeTexts[index] && freeTexts[index]['enableLicenseeBusinessName']) || '';
            return {...receipt, freeText, aboveFreeText, licenseeBusinessName };
        })
        this.props.updateShop({...this.state.shop, receiptInfo: updatedReceiptInfo});
    }  

    setFreeText = (index, text, key) => {
        const { freeTexts=[] } = this.state;
        let updatedFreeTexts = [...freeTexts];
        updatedFreeTexts[index] = updatedFreeTexts[index] || {};
        updatedFreeTexts[index][key] = text;
        this.setState({
            freeTexts: updatedFreeTexts
        });
    }

    render() {
        const { freeTexts, shop={} } = this.state;
        //const { shop={} } = this.props;
        const data = {
            'SALES' : ['enableShopLicenseNumber', 'enableShopAddress', 'enableShopPhoneNo', 'enableEmployeeName', 'enableEmployeeFullLastName', 'enableEmployeeId', 'enablePreparedByEmployeeName', 'enablePreparedByEmployeeFullLastName', 'enablePreparedByEmployeeId', 'enableMemberName', 'enableMemberFullLastName' , 'enableMemberId', 'enableMemberAddress', 'enableMemberPhoneNo', 'enableMemberLoyaltyPoints', 'enableNotes', 'enableOrderDateTime', 'enableOrderNotes', 'enableIncludeItemInSKU', 'enableBrand', 'enableItemDiscount', 'enableItemDiscountNotes', 'enableExciseTaxAsItem'  , {label: 'text above sales details',value:'enabledFreeText'}, {label: 'text below sales details', value: 'enabledBottomFreeText'}, {label: "licensee business name", value: 'enableLicenseeBusinessName'}],
            'FULFILLMENT' : ['enableShopLicenseNumber', 'enableShopAddress', 'enableShopPhoneNo', 'enableEmployeeName', 'enableEmployeeFullLastName', 'enableEmployeeId', 'enableDeliveryDriverName', 'enableDeliveryDriverFullLastName', 'enableDeliveryDriverId', 'enablePreparedByEmployeeName', 'enablePreparedByEmployeeFullLastName', 'enablePreparedByEmployeeId', 'enableMemberName', 'enableMemberFullLastName' , 'enableMemberId', 'enableMemberDeliveryAddress', 'enableMemberAddress', 'enableMemberPhoneNo', 'enableMemberLoyaltyPoints', 'enableNotes', 'enableOrderDateTime', 'enableOrderNotes', 'enableIncludeItemInSKU', 'enableBrand', 'enableItemDiscount', 'enableItemDiscountNotes', 'enableExciseTaxAsItem'  , {label: 'text above sales details',value:'enabledFreeText'}, {label: 'text below sales details', value: 'enabledBottomFreeText'}, {label: "licensee business name", value: 'enableLicenseeBusinessName'}],
            'DELIVERY' : ['enableShopLicenseNumber', 'enableShopAddress', 'enableShopPhoneNo', 'enableEmployeeName' , 'enableEmployeeFullLastName', 'enableEmployeeId', 'enableDeliveryDriverName', 'enableDeliveryDriverFullLastName', 'enableDeliveryDriverId', 'enablePreparedByEmployeeName', 'enablePreparedByEmployeeFullLastName', 'enablePreparedByEmployeeId', 'enableMemberName', 'enableMemberFullLastName' , 'enableMemberId', 'enableMemberDeliveryAddress', 'enableMemberAddress', 'enableMemberPhoneNo', 'enableMemberLoyaltyPoints', 'enableNotes', 'enableOrderDateTime', 'enableOrderNotes', 'enableIncludeItemInSKU', 'enableBrand', 'enableItemDiscount', 'enableItemDiscountNotes', 'enableExciseTaxAsItem'  , {label: 'text above sales details',value:'enabledFreeText'}, {label: 'text below sales details', value: 'enabledBottomFreeText'}, {label: "licensee business name", value: 'enableLicenseeBusinessName'}],
        }
        
        let { receiptInfo=[] } = shop;
        const ReceiptSettings = (receiptInfo && receiptInfo.length && receiptInfo.map((receipt, index) => {
            if(this.state.activeTab === receipt.receiptType){
                return <Receipt 
                    key={index}
                    index={index}
                    keys={data[receipt.receiptType]} 
                    data={receipt} 
                    setOption={this.setOption}
                    receiptInfo={receiptInfo} 
                    shop={shop}      
                    setFreeText={this.setFreeText} 
                    freeText={freeTexts[index]}
                    onEmailChange={this.onEmailChange}
                    uploadEmailAttachment={this.uploadEmailAttachment}
                /> 
            }
            return null
        })) || null;
        return (
            <Grid container>
                <Grid item container xs={12} sm={12} md={12} lg={12} className="cus_posi">
                    <Grid item xs={12} sm={7} md={7} lg={7} className="cus_tabs">
                        <Tabs
                            value={this.state.activeTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={this.changeActiveTab}
                            centered
                        >
                            <Tab label="WALK-INS" value="SALES" />
                            <Tab label="FULFILLMENT" value="FULFILLMENT" />
                            <Tab label="DELIVERY" value="DELIVERY"/>
                        </Tabs>
                    </Grid>
                    {hasAccess() ? <Grid item xs={12} sm={5} md={5} lg={5}>
                        <Button variant="raised" className="primary-button pull-right margin-bottom-small custom_btn" onClick={this.onSave}>Save</Button>
                    </Grid> : <Grid item xs={12} sm={5} md={5} lg={5}/>}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography component="div">
                        {
                            ReceiptSettings
                        }
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

class Receipt extends React.Component {

    render() {
        const { keys, data={}, index, receiptInfo, shop={}, freeText=''} = this.props;
        let selectWithTextBoxCount = 3;
        const optionKeys = keys.filter((key, index, self) => {
            return index < (self.length -selectWithTextBoxCount);
        })
        let textKeys = keys.filter((key, index, self) => {
            return index >= (self.length -selectWithTextBoxCount);
        })
        const showShopLicense = (data && data['enableShopLicenseNumber']) || false;
        const showShopAddress = (data && data['enableShopAddress']) || false;
        const showShopPhoneNumber = (data && data['enableShopPhoneNo']) || false;
        const showLicenseeBusinessName = (data && data['enableLicenseeBusinessName']) || false;
        const showEmployeeName = (data && data['enableEmployeeName']) || false;
        const showEmployeeLastName = (data && data['enableEmployeeFullLastName']) || false;
        const showEmployeeID = (data && data['enableEmployeeId']) || false;
        const showDeliveryDriverName = (data && data['enableDeliveryDriverName']) || false;
        const showDeliveryDriverLastName = (data && data['enableDeliveryDriverFullLastName']) || false;
        const showDeliveryDriverID = (data && data['enableDeliveryDriverId']) || false;
        const showPrepareEmployeeName = (data && data['enablePreparedByEmployeeName']) || false;
        const showPrepareEmployeeLastName = (data && data['enablePreparedByEmployeeFullLastName']) || false;
        const showPrepareEmployeeID = (data && data['enablePreparedByEmployeeId']) || false;
        const showMemberName = (data && data['enableMemberName']) || false;
        const showMemberLastName = (data && data['enableMemberFullLastName']) || false;
        const showMemberID = (data && data['enableMemberId']) || false;
        const showMemberDeliveryAddress = (data && data['enableMemberDeliveryAddress']) || false;
        const showMemberAddress = (data && data['enableMemberAddress']) || false;
        const showMemberPhoneNumber = (data && data['enableMemberPhoneNo']) || false;
        const showMemberLoyalty = (data && data['enableMemberLoyaltyPoints']) || false;
        const showNotes = (data && data['enableNotes']) || false;
        const showCreationDateTime = (data && data['enableOrderDateTime']) || false;
        const showOrderNotes = (data && data['enableOrderNotes']) || false;
        const showItemSKU = (data && data['enableIncludeItemInSKU']) || false;
        const showBrandName = (data && data['enableBrand']) || false;
        const showDiscount = (data && data['enableItemDiscount']) || false;
        const showDiscountNotes = (data && data['enableItemDiscountNotes']) || false;
        const showExciseTax = (data && data['enableExciseTaxAsItem']) || false;
        
        return (
            <Grid container xs={12} sm={12} md={12} lg={12} className="abc">
                <Grid item xs={12} sm={12} md={7} lg={8} className="nopadding receipt_options_container">
                    {
                        optionKeys && optionKeys.length && optionKeys.map((key, i) => {
                            var label = fulfillmentOptions[key];

                            return <Grid container xs={12} sm={12} md={12} lg={12} className="receipt_options" key={i}>
                                <Grid item xs={12} sm={8} md={8} lg={8} className="nopadding">
                                    <p>{label}</p>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}>
                                    {/* <FormControl componentClass="select" value={data[key] || false} onChange={(event) => this.props.setOption(event, index, key, receiptInfo)}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </FormControl> */}
                                    <EditableSwitch
                                        onChange={(event) => this.props.setOption(event, index, key, receiptInfo)}
                                        checked={data[key] || false}
                                        value={data[key]}
                                        editMode={true}
                                    />
                                </Grid>
                            </Grid>
                        })
                    }
                    {
                        textKeys && textKeys.length && textKeys.map((key, i) => {
                            const enabledText = (data && data[key.value]) || false;
                            return <Grid container xs={12} sm={12} md={12} lg={12} key={i}>
                                <Grid xs={12} sm={8} md={8} lg={8} className="nopadding">
                                    <p>
                                        {fulfillmentOptions[key.value]}
                                    </p>
                                </Grid>
                                <Grid xs={12} sm={4} md={4} lg={4}>
                                    <EditableSwitch
                                        onChange={(event) => this.props.setOption(event, index, key.value, receiptInfo)}
                                        checked={data[key.value] || false}
                                        value={data[key.value]}
                                        editMode={true}
                                    />
                                </Grid>
                                {
                                    enabledText ? <Grid container xs={12} sm={12} md={12} lg={12} className="receipt_options" style={{marginBottom: 20}}>
                                        <Grid xs={12} sm={12} md={12} lg={12}>
                                            <FormControl style={{width: "35vh"}}>
                                                <Input
                                                    multiline={true}
                                                    rows={2}
                                                    onChange={(e) => this.props.setFreeText(index, e.target.value, key.value)}
                                                    value={(freeText && freeText[key.value]) || ''}
                                                    placeholder={`Enter ${key.label}`}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid> : null
                                }                                
                            </Grid>
                        })
                    }
                    <Grid container className="email_cus_msg">
                        <Grid className="nopadding" item xs={12} sm={4} md={4} lg={4}>
                            Email Custom Message
                        </Grid>
                        <Grid className="editField" item xs={12} sm={8} md={8} lg={8} style={{padding:20}}>
                            <EditableDraftEditor
                                onChange={(event) => this.props.onEmailChange(event, index, receiptInfo)}
                                emailMessage={data.emailMessage}
                                editMode={true}
                                valueToRender={<RenderHTML message={data.emailMessage} />}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid className="nopadding" item xs={12} sm={4} md={4} lg={4}>
                            Email Attachment
                        </Grid>
                        <Grid className="editField" item xs={12} sm={8} md={8} lg={8}>
                            <EditableImageUploader
                                editMode={true}
                                valueToRender={
                                    <ImagePreview
                                        src={data.emailAttachment && data.emailAttachment.thumbURL}
                                    />
                                }
                                src={data.emailAttachment && data.emailAttachment.thumbURL}
                                imageUploadAPI={(file, type, url) => this.props.uploadEmailAttachment(file, type, url, index, receiptInfo)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={5} lg={4}>
                    <Paper elevation={4} className="receipt_container">
                        <p>Today's date: {`${moment().format('MM/DD/YYYY')}, ${moment().format('hh:mm A')}`}</p>
                        <p>{(shop && shop.name) || ''}</p>
                        {showShopLicense ? <p>Shop's license number: {(shop && shop.license || '')}</p> : null}
                        {showLicenseeBusinessName ? <p>Business name: {freeText['enableLicenseeBusinessName'] || ''}</p> : null}
                        {showCreationDateTime ? <p> Created on: {`${moment().format('MM/DD/YYYY')}, ${moment().format('hh:mm A')}`}</p> : null}
                        {showShopAddress ? <div><p>Shop's address: {(shop && shop.address && shop.address.address) || ''} - {(shop && shop.address && `${shop.address.city}, ${shop.address.state} ${shop.address.zipCode}`) || ''}</p></div> : null}
                        {showShopPhoneNumber ? <p>Shop's phone : {(shop && shop.phoneNumber) || ''}</p> : null}
                        {(data && data.receiptType === "FULFILLMENT") && <p>Fulfillment step: FULFILL</p>}
                        {showPrepareEmployeeName ? <p>Prepared by: Marry {showPrepareEmployeeLastName ? "Jen" : "J."} {showPrepareEmployeeID ? "(ce243)" : null}</p> : null}
                        <p>Prepared date: 04/03/2018, 3:06AM</p>
                        {showEmployeeName ? <p>Employee: Marry {showEmployeeLastName ? "Jen" : "J."} {showEmployeeID ? "(ce243)" : null}</p> : null}
                        {showDeliveryDriverName ? <p>Delivery driver: Marry {showDeliveryDriverLastName ? "Jen" : "J."} {showDeliveryDriverID ? "(ce243)" : null}</p> : null}
                        <p>Trans #: 2487</p>
                        <p>Trans date: 04/03/2018, 11:39AM</p>
                        {showMemberName ? <p>Member: {`${'FTP Nicole'} ${showMemberLastName ? " Parker" : "P."}`} {showMemberID ? "(ch243)" : null}</p> : null}
                        {showMemberPhoneNumber ? <p>Member's phone: 123-456-7890</p> : null}
                        {showMemberDeliveryAddress ? <div><p>Member's delivery address: 147 Shelley Circle - Ventura, CA 93003</p></div> : null}
                        {showMemberAddress ? <div><p>Member's address: 146 Shelley Circle - Ventura, CA 93003</p></div> : null}
                        {showMemberLoyalty ? <p>Member's loyalty points: 75</p> : null}
                        {showNotes ? <p>Member's notes: Notes</p> : null}
                        <p className="receipt_border"></p>
                        {freeText && freeText['enabledFreeText'] ? <p className="receipt_border">{(freeText && freeText['enabledFreeText']) || ''}</p> : null}
                        <strong style={{margin: '5px 0'}}>SALE</strong>
                        <Grid container xs={12} sm={12} md={12} lg={12} className="nopadding">
                            <Grid item xs={12} sm={3} md={3} lg={3} className="nopadding">
                                {showItemSKU ? <div><strong>SKU</strong>
                                <p>3JEA4SDBS9HUG</p></div> : null}
                                <p>-Qty: 1</p>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} className="nopadding">
                                <strong>Description</strong>
                                <p>420 Dark Chocolate</p>
                                {showBrandName? <p>By: Brand</p> : null}
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Price</strong>
                                <p>$50.00</p>
                            </Grid>
                            {showDiscount ? 
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Discount</strong>
                                <p>$5.00</p>
                            </Grid>: null}
                            {showDiscountNotes ? 
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Discount Notes</strong>
                                <p>N/A</p>
                            </Grid>: null}
                        </Grid>
                        <Grid container xs={12} sm={12} md={12} lg={12} className="nopadding">
                            <Grid item xs={12} sm={3} md={3} lg={3} className="nopadding">
                                {showItemSKU ? <div><strong>SKU</strong>
                                <p>57B1IU21BBGL</p></div> : null}
                                <p>-Qty: 1</p>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} className="nopadding">
                                <strong>Description</strong>
                                <p>707 Headband CO</p>
                                {showBrandName? <p>By: Brand</p> : null}
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Price</strong>
                                <p>$28.00</p>
                            </Grid>
                            {showDiscount ? 
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Discount</strong>
                                <p>$5.00</p>
                            </Grid>: null}
                            {showDiscountNotes ? 
                            <Grid item xs={12} sm={2} md={2} lg={2} className="nopadding">
                                <strong>Discount Notes</strong>
                                <p>N/A</p>
                            </Grid>: null}
                        </Grid>
                        <Grid container xs={12} sm={12} md={12} lg={12} className="nopadding" style={{display: 'inline-block', margin: '10px 0'}}>
                            <strong className="pull-left">Subtotal</strong>
                            <strong className="pull-right">$78.00</strong>
                        </Grid>
                        <div className="pull-left text-left">
                            {showExciseTax ? <p>AL Excise Tax</p> : null}
                            {showExciseTax ? <p>NAL Excise Tax</p> : null}
                            <p>City Tax</p>
                            <p>County Tax</p>
                            <p>State Tax</p>
                            <p>Total Tax</p>
                        </div>
                        <div className="pull-right text-right">
                            <p>{showExciseTax ? '($12.00)' : null}</p>
                            <p>{showExciseTax ? '$7.50' : null}</p>
                            <p>$0.86</p>
                            <p>$0.86</p>
                            <p>$0.87</p>
                            <p>$2.59</p>
                        </div>
                        <Grid container xs={12} sm={12} md={12} lg={12} className="receipt_border nopadding" style={{margin: '5px 0'}}>
                            <Grid container className="receipt_border" />
                            <Grid container xs={12} sm={6} md={6} lg={6} justify="flex-start">
                                <p>Total</p>
                            </Grid>
                            <Grid container xs={12} sm={6} md={6} lg={6} justify="flex-end">
                                <p>$85.09</p>
                            </Grid>
                        </Grid>
                        <Grid container xs={12} sm={12} md={12} lg={12} className="nopadding">
                            <div>
                                {showOrderNotes ? <p>Order notes: Show Walk-ins or Sales</p>: null}
                                <p>Payment type: Check</p>
                                <p>Total payment received: $85.09</p>
                                <p>Change due: $0.00</p>
                                <p>The cannabis excise taxes are included in the total amount of this invoice.</p>
                            </div>
                            <Grid item xs={12} className="nopadding receipt_border" style={{margin: '10px 0'}}>
                                <p className="receipt_border"></p>
                                <p className="pull-left">Member Signature</p>
                            </Grid>
                            <Grid container justify="center">Member Signature</Grid>
                            {freeText && freeText['enabledBottomFreeText'] ? <p>{(freeText && freeText['enabledBottomFreeText']) || ''}</p> : null}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default connect((state) =>({
    dispatch: state.dispatch
}))(ShopSettingsWithUpdate(ContainerWithTitle(ManageReceipts, 'Manage Receipt Settings')));