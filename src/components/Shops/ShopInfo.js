import React, { Fragment } from 'react';
import {
    Grid,
    Paper,
    ListItem,
    MenuItem,
    Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
    ArrowBack as ArrowBackIcon
  } from "@material-ui/icons";

import {Redirect} from 'react-router-dom';


import EditActionComponent from '../common/EditActionComponent';
import {
    EditableTextField,
    EditableSelect,
    EditableReactSelectCreatable,
} from '../common/EditableComponents';
import { EditableImageUploader, ImagePreview } from '../common/ImageUploader';
import { globalValidator, checkEmail } from '../../utils/validations/common';
import ReactPhoneInput from '../common/ReactPhoneInput';
import '../../style/common.css';


import {
    shopTypes,
    getCaStates,
    getUsStates,
    flowerTypes,
    Appcues,
    logoConstant,
} from '../../utils/constants';
import { getObject } from '../../utils/api';
import { getShopById, updateShop } from '../../actions/shop';
import { openErrorMessage } from '../../actions/message';
import { getCommittedConfig, getCompany, getCompanyFeatures } from '../../actions/company';


class ShopInfo extends React.Component {    
    constructor() {
        super();
        this.state = {
            creatingLocationMode: false,
            newLocationName: null,
            newLocationTypeName: null,
            onFleetTeamInfo: {},
            data:{},
            initialData:{},
            toReturn:false
        };
    }

    componentDidMount=()=>{
        // this.props.dispatch(getCompanyFeatures());
        // this.props.dispatch(getCompany());
        const callFromDataBase = async () => { 
            const id = getObject("selectedShopId");
            const result = await this.props.dispatch(getShopById(id));
            this.setState({data:JSON.parse(JSON.stringify(result))});
            this.setState({initialData:JSON.parse(JSON.stringify(result))});
        }
        callFromDataBase();
        

    }

    onChange = (key, isCheckBox) => e => {

        const value = isCheckBox ? e.target.checked : e.target.value;

        this.props.onChange(key, value)

        this.state.data[key]=value;

    }

    onChangePhone = (e,key) => {
        this.props.onChange(key,e);
        this.state.data[key]=e;
    }

    onSave = () => {
        this.cancelCreateLocation();
        const keys = [
            { name: 'emailAdress', title: 'Email', validateKey: 'email' },
            { name: 'phoneNumber', title: 'Phone', validateKey: 'phone' }
        ];

        let valid = true || globalValidator(this.state.data, keys);
        if ( valid) {
            this.props.dispatch(updateShop(this.state.data));
            this.props.disableEdit()
        }
        else {
            this.props.dispatch(openErrorMessage(valid));
        }
    }

    onCancel = () => {
        this.cancelCreateLocation();
        this.props.onCancel();
        console.log(this.state.initialData);
        this.setState((prevState)=>{return{data:JSON.parse(JSON.stringify(prevState.initialData))}});
    }

    onChangeAddress = key => e => {

        const { data } = this.state;
        const { address } = data;

        let newAddress = { ...address }

        newAddress = {
            ...newAddress,
            [key]: e.target.value
        }

        if (key === 'country') {
            newAddress = {
                ...newAddress,
                state: ''
            }
        }

        this.props.onChange('address', newAddress)

    }

    onChangeCreatableOptions = key => values => {

        let updatedValues = (values && values.length && values.map((value) => {
            return value.value
        })) || [];

        this.props.onChange(key, updatedValues);
    }


    onChangeNumber = (key) => (val) => {
        this.props.onChange(key, val);
    }

    toggleCreateLocation = () => {
        const creating = this.state.creatingLocationMode;
        if(!creating){
            //pull metrc location types
            this.retrieveLocationTypes();
        }
        this.setState({
            creatingLocationMode: !creating
        })
    }

    cancelCreateLocation = () =>{
        this.setState({creatingLocationMode: false});
    }

    onChangeLocationType = (locationType) => (e) => {
        let target = e.target.value;

        if(target && target != ''){
            this.setState({
                newLocationTypeName: target
            })
        }
    }

    onChangeLocation = (location) => (e) => {
        let target = e.target.value || '';
        this.setState({
            newLocationName: target
        })
    }

    
  returnToShop = shop => {
    this.setState({toReturn:true});
    };

    render() { 

        const {
            editMode = false,
            // data = {},
        } = this.props;
            
        const data = this.state.data;
        const editModeClass = editMode ? 'editable_field' : '';

        if (this.state.toReturn === true) {
            return <Redirect to="/switch" />;
        }

        return (
            <div>
                <Grid container>
                <Grid item>
                    <a onClick={this.returnToShop.bind(this)} href="javascript:void(0);" className="striped-link">
                        <Typography variant="subtitle1" color="inherit" noWrap className="text-capitalize">
                        {//should be the page that came from
                        }
                        <ArrowBackIcon style={{
                            float: 'left',
                            marginRight: 10
                        }} /> Back To Switch App 
                        </Typography>
                    </a>
                </Grid>
                
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div className="pull-right margin-bottom-small">
                            <EditActionComponent
                                onSave={this.onSave}
                                onCancel={this.onCancel}
                                onEdit={this.props.enableEdit}
                                editMode={editMode}
                            />
                        </div>
                    </Grid>
                    <Grid className={`shopInfo ${editModeClass}`} container>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Paper className="paper-page">
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Shop Name *
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.name}
                                                editMode={editMode}
                                                value={data.name}
                                                onChange={this.onChange('name')}
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
                                            Shop Type *
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableSelect
                                                value={data.shopType}
                                                onChange={this.onChange('shopType')}
                                                valueToRender={data.shopType}
                                                editMode={editMode}
                                            >
                                                {
                                                    shopTypes.map((shopType, index) => {
                                                        return <MenuItem key={index} value={shopType.value}>{shopType.label}</MenuItem>
                                                    })
                                                }

                                            </EditableSelect>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" xs={12} sm={6} md={6} item lg={6}>
                                            Shop Logo
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableImageUploader
                                                editMode={editMode}
                                                valueToRender={
                                                    <ImagePreview
                                                        src={logoConstant}
                                                    />
                                                }
                                                src={logoConstant}
                                                imageUploadAPI={this.uploadShopLogo}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Email *
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.emailAdress}
                                                editMode={editMode}
                                                value={data.emailAdress}
                                                onChange={this.onChange('emailAdress')}
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
                                            Phone *
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            {editMode ? 
                                                <ReactPhoneInput
                                                    defaultCountry={'us'}
                                                    placeholder={'Phone Number'}
                                                    onChange={(e) => this.onChangePhone(e,'phoneNumber')} 
                                                    preferredCountries={['us', 'ca']}
                                                    inputClass="global-phone-input"
                                                    name="phoneNumber"
                                                    value={(data && data.phoneNumber) || ''}
                                                    containerClass="form-control phone-input"
                                                />
                                           :
                                                `${data && data.phoneNumber || ""}`
                                            }
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Shop License *
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.license}
                                                editMode={editMode}
                                                value={data.license}
                                                onChange={this.onChange('license')}
                                                type="text"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Paper className="paper-page">
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Country
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableSelect
                                                value={data.address && data.address.country}
                                                onChange={this.onChangeAddress('country')}
                                                valueToRender={data.address && data.address.country}
                                                editMode={editMode}
                                                displayEmpty={true}
                                            >
                                                <MenuItem value="">Select Country</MenuItem>
                                                <MenuItem value={'US'}>United States</MenuItem>
                                                <MenuItem value={'CA'}>Canada</MenuItem>
                                            </EditableSelect>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid className="labelField" item xs={12} sm={6} md={6} lg={6}>
                                            Address
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.address && data.address.address}
                                                editMode={editMode}
                                                value={data.address && data.address.address}
                                                onChange={this.onChangeAddress('address')}
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
                                            City
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.address && data.address.city}
                                                editMode={editMode}
                                                value={data.address && data.address.city}
                                                onChange={this.onChangeAddress('city')}
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
                                            Zip Code
                                        </Grid>
                                        <Grid className="editField" item xs={12} sm={6} md={6} lg={6}>
                                            <EditableTextField
                                                valueToRender={data.address && data.address.zipCode}
                                                editMode={editMode}
                                                value={data.address && data.address.zipCode}
                                                onChange={this.onChangeAddress('zipCode')}
                                                type="text"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        companyReducer: state.companyReducer,
        shopReducer: state.shopReducer,
        authReducer: state.authReducer,
    };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch: dispatch,
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(ShopInfo)
