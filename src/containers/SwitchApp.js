import React, { PureComponent, Fragment, createRef } from 'react';
import {Link} from 'react-router-dom';
import { Button, Grid, Paper } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
// import { EditableReactSelect } from '../components/common/EditableComponents';
import { connect } from 'react-redux';


import { switchApp, changeShop } from '../actions/auth';
import { updateEmployee } from '../actions/employee';
import { startLoading, stopLoading } from '../actions/loading';
import { getCompanyFeatures } from '../actions/company';
import { addShop, getShopList } from '../actions/shop';
import { openErrorMessage } from '../actions/message';


import Heading from '../components/common/Heading';
import NavHeader from '../components/layout/NavHeader';
import ContainerWithTitle from './HOC/ContainerWithTitle';
import AddShopModal from '../components/modal/AddShopModal';
import { getSession } from '../utils/api';
import { logoConstants, appTargets } from '../utils/constants';

class SwitchApp extends PureComponent {
    constructor(){
        super();
        this.state = {
            shopId: '',
            selectedOrganization: '',
            selectedCompany: '',
            companiesOptionsTemp: [],
            companyFeatures: {}
        }
    }
  

    addShopModal = createRef()

    switchApp = (appName, shopId) => e => {

        this.props.dispatch(startLoading())

        this.props.dispatch(switchApp({ appName, shopId }))
            .then(newSession => {
                window.location.href = `${newSession.redirectURL}/login?token=${newSession.accessToken}`
                this.props.dispatch(stopLoading())
            })
    }

    onShopChange = (shopId, appName) => {
        this.setState({ shopId });
        this.props.dispatch(startLoading());
        if (appName === 'Grow') {
            this.props.dispatch(changeShop(shopId, 'Sales'))
                .then(session => {
                    //const switchAppWithAppName = this.switchApp(appName, shopId)
                    //switchAppWithAppName();
                    //window.location.reload();
                })
        }
        else {
            this.props.dispatch(changeShop(shopId))
                .then(session => {
                    //const switchAppWithAppName = this.switchApp(appName, shopId)
                    //switchAppWithAppName();
                    //window.location.reload();
                })
        }
    }

    //Filter shops with the organization and company selected
    filterShops = (shops) => {
        const { organizationsList = {} } = this.props.organizationReducer;
        const { companyList = {} } = this.props.companyReducer;
        let companyIds = (companyList.length && companyList.map( company => company.id))|| [];
        const itemOrganization = organizationsList.length && organizationsList.find(e => e.id === this.state.selectedOrganization.value);
        if (itemOrganization !== undefined) {
            companyIds = itemOrganization.companyIds;
        }
        //If employee doesn't belong to any organization, use its companyId
        if (organizationsList.length===0){
            if (!Array.isArray(companyIds)){
                companyIds=[];
            }
            let { employee } = getSession();
            companyIds.push(employee.companyId);
        }
        let filteredShops = shops && shops.filter(shop => 
                (companyIds && companyIds.length === 0) || ((!this.state.selectedCompany && companyIds && companyIds.includes(shop.companyId))
                || (this.state.selectedCompany && this.state.selectedCompany.value===shop.companyId))
        )
        return filteredShops;
    }

    filterOutShops = shops => {
        let targets = {}
        shops = shops || []
        shops = this.filterShops(shops)
        shops.filter(shop => shop.active).forEach(shop => {
            let appTarget = shop.appTarget
            targets[appTarget] = targets[appTarget] || []
            targets[appTarget].push(shop)
        });

        return targets

    }

    addShop = data => {
        let { employee } = getSession();

        this.props.dispatch(addShop(data))
            .then(shop => {
                employee.shops.push(shop.id);
                this.props.dispatch(updateEmployee(employee, shop))
                    .then(res => {
                        this.props.dispatch(getShopList())
                        this.addShopModal.current.handleClose()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(error => {
                console.log(error);
            });
    }

    onError = message => this.props.dispatch(openErrorMessage(message))

    openAddShopModal = app => e => {

        this.addShopModal.current.handleClickOpen(app)

    }

    async callFromDatabase() {
        
        //const shopList = await this.props.dispatch(getShopList());
        const companyFeaturesList = await this.props.dispatch(getCompanyFeatures());
        //const organizationList = await this.props.dispatch(getOrganizations());
        const session = getSession()
        this.setState((_, props) => ({
            selectedCompany: '',
            selectedOrganization: '',
            shopId: (session && session.assignedShop && session.assignedShop.id) || '',
            companyFeatures: companyFeaturesList
        }));
    }

    componentDidMount() {
        this.callFromDatabase();
    }

    componentWillReceiveProps(nextProps) {
        const { session = {} } = nextProps.authReducer;
        if (this.props.authReducer.session && this.props.authReducer.session.accessToken !== session.accessToken) {
            this.setState({
                shopId: (session && session.assignedShop && session.assignedShop.id) || ''
            })
        }
    }

    goToShop = (obj) => {
        //const user = getSession();
        let host = '';
        //let { session = {} } = this.props.authReducer;
        //let { assignedShop } = session;

        host = appTargets[obj.appTarget];

        let data = {
            appName: obj.appTarget,
            shopId: obj.id
        }

        if (obj.appTarget === 'Grow') {
            data = {
                ...data,
                growAppType: 'Sales'
            }
        }
        this.props.dispatch(switchApp(data))
            .then(res => {
                let token = res.accessToken;

                if (obj.appTarget === 'Grow') {
                    token = decodeURIComponent(res.accessToken);
                }

                window.location.href = `${host}/login?token=${token}&shop=${obj.id}`;
            })
            .catch(err => {
                console.log(err);
            });
    }

    filterCompanies = (selectedOrganization) => {
        const { organizationsList = {} } = this.props.organizationReducer;
        const itemOrganization = organizationsList.find(e => e.id === selectedOrganization.value);
        if (itemOrganization !== undefined) {
                const { companyList = {} } = this.props.companyReducer;
                if (Array.isArray(companyList)){
                    return companyList.filter(c => itemOrganization.companyIds.includes(c.id)).map(company => {
                        return { label:company.name, value:company.id }
                    });  
                }
        } else {
            this.setState({selectedCompany: ''});
        }
        return [];
    }

    selectFirstCompanyShop = (firstCompanyOption) => {
        const { shopsList = {} } = this.props.shopReducer;
        const shopListToFilter = shopsList.values || []
        const filteredOutShops = this.filterOutShops(shopListToFilter);
        if(Object.keys(filteredOutShops).length > 0 ){
            const appAccessList =  Object.keys(filteredOutShops).filter(app => app !== 'AuthenticationApp')
            const arrAppShops = filteredOutShops[appAccessList[0]]
            if(arrAppShops.length > 0) {
                const firstShop = arrAppShops[0]
                this.onShopChange(firstShop.id, appAccessList[0])
            }
            
        }
    }

    onChangeOrganizations = (organization) => {
        const selectedOrganization = organization || '';
        // Filter companies based on my  selected organization
        const filteredCompanyList = this.filterCompanies(selectedOrganization);
        const firstCompanyOption =  filteredCompanyList.length>0?filteredCompanyList[0]:'';
        
        this.setState({selectedOrganization: selectedOrganization,selectedCompany:firstCompanyOption, companiesOptionsTemp: filteredCompanyList}, () =>{
            if(firstCompanyOption != '') { // eslint-disable-line
                this.selectFirstCompanyShop(firstCompanyOption)
            }
        });
    }

    selectInitialOrganization = () => {
        const { organizationsList = {} } = this.props.organizationReducer;
        const { companyList = {} } = this.props.companyReducer;
        const { shopsList = {} } = this.props.shopReducer;
        const shopsListValues = shopsList.values || []

        let selectedOrganization = this.state.selectedOrganization || '';
        const organizationOptions = (organizationsList.length && organizationsList.map(organization => {
            return {label: organization.name, value: organization.id}
        })) || [];

        if (selectedOrganization == '' && organizationOptions.length>0 && companyList.length > 0 && shopsListValues.length > 0){ // eslint-disable-line
            selectedOrganization = organizationOptions[0];
            this.onChangeOrganizations(selectedOrganization);
        }
    }

    onChangeCompanies = (company) => {
        const selectedCompany = company || '';
        this.setState({selectedCompany: selectedCompany}, () =>{
            this.selectFirstCompanyShop(selectedCompany)
        })
    }

    render() {
        const { authReducer } = this.props;
        const { session = {} } = authReducer;
        const { employee = {}, assignedShop = {}, employeeShops = [] } = session;
        let { appAccessList = [] } = employee || {};
        const { shopsList = {} } = this.props.shopReducer;
        const shopsListValues = shopsList.values || []
        const { organizationsList = {} } = this.props.organizationReducer;
        const shopListToFilter = this.state.selectedOrganization == ''? employeeShops: shopsListValues; // eslint-disable-line
        const filteredOutShops = this.filterOutShops(shopListToFilter);
        const { maxShop = '', availableApps = [] } = this.state.companyFeatures || {}
        appAccessList = availableApps.length > 0 ? availableApps : Object.keys(filteredOutShops).filter(app => app !== 'AuthenticationApp')
        let selectedOrganization = this.state.selectedOrganization || '';
        const selectedCompany = this.state.selectedCompany || [];
        const organizationOptions = (organizationsList.length && organizationsList.map(organization => {
            return {label: organization.name, value: organization.id}
        })) || [];
       
        console.log("maxShop",this.state.companyFeatures)
        this.selectInitialOrganization();

        var filteredShopEntries = Object.entries(filteredOutShops);
        var count = 0;
        if (filteredShopEntries.length>0){
            filteredShopEntries.forEach(([key, value]) => {
                count+=value.length;
            });
        }
        return (
            <Grid container className="center-aligned-child shopsLayout pb-4">
                <NavHeader shops={shopsListValues} assignedShop={assignedShop} dispatch={this.props.dispatch} />
                <Grid item lg={12} className="full-width">
                    <Heading className="font-normal vertical-middle total-shops">
                        Total Locations ({count}/{maxShop})
                    </Heading>
                </Grid>

                {appAccessList.length &&
                    appAccessList.filter(app => app !== 'AuthenticationApp' && app !== 'Dispatch' && app !== 'Insights' && app !== 'Worker').map(
                        (app, index) => {
                            const shops = filteredOutShops[app] || [];
                            return (
                                <Grid key={index} item lg={12} className="margin-top-medium remove-margin">
                                    <Heading className="font-normal vertical-middle font-title">
                                        <img 
                                            style={{
                                                width: 40,
                                                height: 40,
                                                marginRight: 15
                                            }}
                                            src={logoConstants[app]} 
                                            alt=""
                                        />
                                        {app !== 'Grow' ? app === 'Distribution' ? 'Distro ' : `${app} ` : 'Cultivation '}Locations
                                    </Heading>
                                    <div container className="full-width">
                                        {
                                            shops.map(
                                                (shop, index) => {
                                                    return (
                                                        <div key={index} className="main-menus-listing">
                                                            <Paper
                                                                data-cy={'btn-store-shop'}
                                                                elevation={8}
                                                                className={`center-aligned-child menu-inner-list child-column column-child full-width ${this.state.shopId === shop.id ? 'selectedShopBg' : ''}`}
                                                                onClick={() => this.onShopChange(shop.id, app)}>
                                                                <div className="icon-sec">
                                                                    <img
                                                                        style={{
                                                                            width: 75,
                                                                            height: 75
                                                                        }}
                                                                        alt=""
                                                                        src={shop.logo ? shop.logo.mediumURL : logoConstants[app]} />
                                                                </div>
                                                                <span>{shop.name}</span>
                                                            </Paper>
                                                            {this.state.shopId === shop.id && shop.appTarget === 'Grow' ? <Fragment><Button data-cy='btn-shop-operation' variant="raised" className={shop.appTarget} style={{ marginTop: 20 }} >Operations</Button><Button data-cy= 'btn-shop-sales' variant="raised" className={shop.appTarget} style={{ marginTop: 20, marginLeft: 4 }} onClick={this.goToShop.bind(this, shop)}>Sales</Button></Fragment> : null}
                                                            {this.state.shopId === shop.id && shop.appTarget !== 'Grow' ? <Button data-cy='btn-shop-location' variant="raised" className={shop.appTarget} style={{ marginTop: 20 }} onClick={this.goToShop.bind(this, shop)}>Go to Location</Button> : null}
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                        {employeeShops.length < maxShop ? <div key={index} className="main-menus-listing">
                                            <Paper
                                                elevation={8}
                                                className="center-aligned-child menu-inner-list child-column column-child full-width"
                                                onClick={this.openAddShopModal(app)}
                                            >
                                                <div className="icon-sec">
                                                    <AddIcon style={{ fontSize: 40 }} className="margin-bottom-small" />
                                                </div>
                                                <span>Add Location</span>
                                            </Paper>
                                        </div> : null}
                                    </div>
                                </Grid>
                            )
                        }
                    )
                }
                
                <AddShopModal
                    ref={this.addShopModal}
                    addShop={this.addShop}
                    onError={this.onError}
                />
            </Grid>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
        shopReducer: state.shopReducer,
        organizationReducer: state.organizationReducer,
        companyReducer: state.companyReducer
    };
  }
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    };
  }

export default connect(mapStateToProps,mapDispatchToProps)(ContainerWithTitle(SwitchApp, 'Switch App'));
