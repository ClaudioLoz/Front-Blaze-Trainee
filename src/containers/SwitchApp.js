import React, { PureComponent, Fragment, createRef } from "react";
import { Button, Grid, Paper } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
// import { EditableReactSelect } from '../components/common/EditableComponents';
import { connect } from "react-redux";

import { switchApp } from "../actions/auth";
import { updateEmployee } from "../actions/employee";
import { startLoading, stopLoading } from "../actions/loading";
import { getCompanyFeatures } from "../actions/company";
import { addShop, getShopList } from "../actions/shop";
import { openErrorMessage } from "../actions/message";

import Heading from "../components/common/Heading";
import NavHeader from "../components/layout/NavHeader";
import AddShopModal from "../components/modal/AddShopModal";
import ContainerWithTitle from "./HOC/ContainerWithTitle";
import { getSession,saveObject } from "../utils/api";
import { logoConstant } from "../utils/constants";
import  '../style/common.css';

class SwitchApp extends PureComponent {
  constructor() {
    super();
    this.state = {
      shopId: "",
      companyFeatures: {},
      shopList: [], //should not be here
    };
  }
  callFromDataBase = async () => {
    const shopList = await this.props.dispatch(getShopList());
    const companyFeaturesList = []; //await this.props.dispatch(getCompanyFeatures());
    const session = getSession();
    this.setState({
      shopId:
        (session && session.assignedShop && session.assignedShop.id) || "",
      companyFeatures: companyFeaturesList,
      shopList, //should not be here
    });
  };
  componentDidMount() {
    this.callFromDataBase();
  }

  addShopModal = createRef();

  switchApp = (appName, shopId) => (e) => {
    this.props.dispatch(startLoading());

    this.props.dispatch(switchApp({ appName, shopId })).then((newSession) => {
      this.props.dispatch(stopLoading());
      window.location.href = `${newSession.redirectURL}/login?token=${newSession.accessToken}`;
    });
  };

  onShopChange = (shopId) => {
    this.setState({ shopId });
    saveObject("selectedShopId",shopId);
  };


  filterOutShops = (shops) => {
    let targets = {};
    shops = shops || [];
    shops
      .filter((shop) => shop.active)
      .forEach((shop) => {
        let appTarget = shop.appTarget;
        targets[appTarget] = targets[appTarget] || [];
        targets[appTarget].push(shop);
      });

    return targets;
  };

  addShop = (data) => {
    this.props
      .dispatch(addShop(data))
      .then((shop) => {
        this.callFromDataBase();
        this.addShopModal.current.handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onError = (message) => this.props.dispatch(openErrorMessage(message));

  openAddShopModal = (app) => (e) => {
    this.addShopModal.current.handleClickOpen(app);
  };

  render() {
    const { authReducer } = this.props;
    const { session = {} } = authReducer;
    let { appAccessList = [] } = {};
    const { shopsList = {} } = this.props.shopReducer;
    const shopsListValues = shopsList.values || [];
    const { organizationsList = {} } = this.props.organizationReducer;
    const shopListToFilter = this.state.shopList; // eslint-disable-line
    const filteredOutShops = this.filterOutShops(shopListToFilter);
    const { maxShop = 6, availableApps = [] } =
      this.state.companyFeatures || {};
    appAccessList =
      availableApps.length > 0
        ? availableApps
        : Object.keys(filteredOutShops).filter(
            (app) => app !== "AuthenticationApp"
          );

    var filteredShopEntries = Object.entries(filteredOutShops);
    var count = 0;
    if (filteredShopEntries.length > 0) {
      filteredShopEntries.forEach(([key, value]) => {
        count += value.length;
      });
    }
    return (
      <Grid container className="center-aligned-child shopsLayout pb-4">
        <Grid item>
          <NavHeader shops={shopsListValues} dispatch={this.props.dispatch} />
        </Grid>
        <Grid item  className="full-width">
          <Heading className="font-normal vertical-middle total-shops">
            Total Locations ({count}/{maxShop})
          </Heading>
        </Grid>
        {appAccessList.length &&
          appAccessList
            .filter(
              (app) =>
                app !== "AuthenticationApp" &&
                app !== "Dispatch" &&
                app !== "Insights" &&
                app !== "Worker"
            )
            .map((app, index) => {
              const shops = filteredOutShops[app] || [];
              return (
                <Grid
                  key={index}
                  item
                  lg={12}
                  className="margin-top-medium remove-margin"
                >
                  <Heading className="font-normal vertical-middle font-title">
                    Locations
                  </Heading>
                  <div container className="full-width">
                    {shops.map((shop, index) => {
                      return (
                        <div key={index} className="main-menus-listing">
                          <Paper
                            background-color="blue"
                            elevation={8}
                            className={`center-aligned-child menu-inner-list child-column column-child full-width ${
                              this.state.shopId === shop.id
                                ? "selectedShopBg"
                                : ""
                            }`}
                            onClick={() => this.onShopChange(shop.id)}
                          >
                            <div className="icon-sec">
                              <img
                                style={{
                                  width: 75,
                                  height: 75,
                                }}
                                alt=""
                                src={
                                  shop.logo ? shop.logo.mediumURL : logoConstant
                                }
                              />
                            </div>
                            <span>{shop.name}</span>
                          </Paper>
                          {this.state.shopId === shop.id &&
                          shop.appTarget !== "Grow" ? (
                            <Button
                              variant="contained"
                              style={{ marginTop: 5 }}
                            >
                              Go to Location
                            </Button>
                          ) : null}
                        </div>
                      );
                    })}
                    { (//should be only if employeeShops.length < maxShop
                      <div key={index} className="main-menus-listing">
                        <Paper
                          elevation={8}
                          className="center-aligned-child menu-inner-list child-column column-child full-width"
                          onClick={this.openAddShopModal(app)}
                        >
                          <div className="icon-sec">
                            <AddIcon
                              style={{ fontSize: 40 }}
                              className="margin-bottom-small"
                            />
                          </div>
                          <span>Add Location</span>
                        </Paper>
                      </div>
                    )}
                  </div>
                </Grid>
              );
            })}

        <AddShopModal
          ref={this.addShopModal}
          addShop={this.addShop}
          onError={this.onError}
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authReducer: state.authReducer,
    shopReducer: state.shopReducer,
    organizationReducer: state.organizationReducer,
    companyReducer: state.companyReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerWithTitle(SwitchApp, "Switch App"));
