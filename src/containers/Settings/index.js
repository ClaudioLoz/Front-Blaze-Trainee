/* eslint no-script-url: 0 */
import React from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

// import { withStyles } from "@material-ui/core/styles";

import {
  Drawer,
  Typography,
  Hidden,
  Divider,
  Paper
} from "@material-ui/core";

import {
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";

import { checkIsAppTargetRoute } from "../../utils/common";


import ExpandableList from '../../components/common/ExpandableList/ExpandableList';
// import MasterCatalogPage from "./MasterCatalog/MasterCatalogPage";
// import CompanyPage from './Company/CompanyPage';
import ShopPage from './Shop/ShopPage';
// import ManageEmployees from './Employees/ManageEmployees';
import { logOut } from '../../utils/api';
import { changeShop} from '../../actions/auth';
import _ from 'lodash';
import '../../style/common.css';

const drawerWidth = '290';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  appBar: {
    position: "absolute",
    marginLeft: `${drawerWidth}`,
    color: "white",
    [theme.breakpoints.up("md")]: {
      width: `calc(${drawerWidth}-20%)`
    }
  },
  appBarShift: {
    marginLeft: `${drawerWidth}px`,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  navIconHide: {
    marginRight: 5
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: "flex",
    alignItems: "center",
    paddingLeft: 30
  },
  drawerPaper: {
    width: `${drawerWidth}px`,
    height: "auto",
    border: "none",
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    width: `calc(100% - ${drawerWidth}px - ${theme.spacing.unit * 3 * 2}px)`,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class ResponsiveDrawer extends React.Component {

  constructor(){
    super();
    this.state = {
      mobileOpen: true,
      dropdown: false,
      companyFeatures: {},
      filteredList: [],
      enableMfg: false,
    };
    
  }
  _isMounted = false;
  getSession() {
    if (window && window.localStorage) {
      return window.localStorage.getObject('session');
    }
  
    return null;
  }

  async componentDidMount() {
    
  }

  filterMfgFromList(sidebarListFiltered){
    let filteredList = [];
    let isMfgAvailable = this.isMfgAvailable();
    if (isMfgAvailable){
      filteredList = sidebarListFiltered
    }else{
      filteredList = sidebarListFiltered && sidebarListFiltered.filter(i => i.url!== 'manufacturing');      
    }
    this.setState({filteredList: filteredList});
    this.setState({enableMfg: isMfgAvailable});

  }

  isMfgAvailable() {
    const { session = {} } = this.props.authReducer;
    const { assignedShop = {} } = session || {};

    return assignedShop.enableMfg;
  }

  filterSpenceStrongholdFromList(availableTabs){
    let filteredList = [];
    if (this.isSpenceAvailable() && this.isStrongholdAvailable()){
      filteredList = availableTabs;
    }else{
      for (let item of availableTabs) {
        if (item.url === 'integration'){
          let newChildrenList = item.childrenList && item.childrenList.filter(i => (this.isSpenceAvailable() || i.url !== 'spence') && (this.isStrongholdAvailable() || i.url !== 'stronghold')) || [];
          item.childrenList = newChildrenList;
        }
        filteredList = [...filteredList, item]
      }
    }
    this.setState({
      filteredList: filteredList
    })
    return filteredList;
  }

  isSpenceAvailable() {
    const { session = {} } = this.props.authReducer;
    const { assignedShop = {} } = session || {};
    const { companyFeatures={} } = this.state
    const { spencePaymentByShops = {} } = companyFeatures

    let shopId = assignedShop && assignedShop.id
    let spencePaymentShopIds = Object.keys(spencePaymentByShops)

    if (spencePaymentShopIds.length === 0 || !Boolean(shopId)) {
        return false
    }

    return !!Boolean(spencePaymentByShops[shopId])
  }

  isStrongholdAvailable() {
    const { session = {} } = this.props.authReducer;
    const { assignedShop = {} } = session || {};
    const { companyFeatures={} } = this.state
    const { strongholdPaymentByShops = {} } = companyFeatures

    let shopId = assignedShop && assignedShop.id
    let strongholdPaymentShopIds = Object.keys(strongholdPaymentByShops)

    if (strongholdPaymentShopIds.length === 0 || !Boolean(shopId)) {
        return false
    }

    return !!Boolean(strongholdPaymentByShops[shopId])
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  onItemClick = (item, parentItem) => {
    this.props.history.push(`/settings/${parentItem.url}/${item.url}`);
    if (window.innerWidth < 989) {
      this.handleDrawerToggle();
    }
  };

  logout = () => {
    logOut().then(() => {
      this.props.history.push("/");
    });
  };

  toggleDropdown = e => {
    e.stopPropagation();
    this.setState({ dropdown: !this.state.dropdown });
  };

  findShop = (id, shops) => {
    const shop = shops.find(item => item.id === id) || {};
    return shop.name || "";
  };

  handleChange = obj => {
    this.setState({ dropdown: false });
    let { session = {} } = this.props.authReducer;
    let { assignedShop } = session || {};
    if (obj.id === assignedShop.id) {
      return false;
    }

    const splittedRoutes = this.props.location.pathname.split("/");

    const currentRoute = splittedRoutes[splittedRoutes.length - 1];
    if (obj.appTarget === "Grow") {
      this.props.dispatch(changeShop(obj.id, "Sales")).then(res => {
        if (checkIsAppTargetRoute(obj.appTarget, currentRoute)) {
          window.location.reload();
        } else {
          this.props.history.push("/settings/shop");
          window.location.reload();
        }
      });
    } else {
      this.props.dispatch(changeShop(obj.id)).then(res => {
        if (checkIsAppTargetRoute(obj.appTarget, currentRoute)) {
          window.location.reload();
        } else {
          this.props.history.push("/settings/shop");
          window.location.reload();
        }
      });
    }
  };

  goToPage = url => {
    this.props.history.push(`/${url}`);
  };

  returnToShop = shop => {
      return this.props.history.push("/switch");
  };


  flexRoot = () => {
    let path = this.props.location.pathname;
    if (path === "/settings/master-catalog/products" || path === "/settings/master-catalog/categories") {
      return "master-catalog-tables";
    }
    else {
      return "root-drawer";
    }
  }

  render() {
    let rootClass = this.flexRoot(this.props.location.pathname);
    const { classes, theme, match } = this.props;
    const { filteredList } = this.state
    const { pathname } = this.props.location;

    const activePath = pathname.split(match.url);

    let currentUrl = "";
    let currentRoute = "";

    if (activePath.length && typeof activePath[1] !== "undefined") {
      currentUrl = activePath[1].split("/")[1] || "shop";
      currentRoute = activePath[1].split("/")[2] || "";
    }

    const { session = {} } = this.props.authReducer;
    const { assignedShop = {}, employeeShops = [] } = session || {};

    const shopDetails = {};

    employeeShops &&
      employeeShops.length &&
      employeeShops
        .filter(shop => shop.active)
        .forEach((item, i) => {
          if (shopDetails[item.appTarget]) {
            shopDetails[item.appTarget].push(item);
          } else {
            shopDetails[item.appTarget] = [item];
          }
        });

    const returnUrl = window.localStorage.getItem("returnUrl");
    let returnOptions = {
      'grow': 'Grow',
      'distribution': 'Distro',
      'apps': 'Apps',
      'retail': 'Retail',
      'dispatch': 'Dispatch'
    }
    const drawer = (
      <div>
        <div className={classes?.toolbar}>
          <a onClick={this.returnToShop.bind(this, returnUrl)} href="javascript:void(0);" className="striped-link">
            <Typography variant="subtitle1" color="inherit" noWrap className="text-capitalize">
              <ArrowBackIcon style={{
                float: 'left',
                marginRight: 10
              }} /> Back To {returnUrl ? returnOptions[returnUrl] : returnOptions['apps']}
            </Typography>
          </a>
        </div>
        <Divider />
        <ExpandableList
          list={filteredList}
          onItemClick={this.onItemClick}
          currentUrl={currentUrl}
          currentRoute={currentRoute}
          assignedShop={assignedShop}
          goToPage={this.goToPage}
        />
      </div>
    );

    return (
      <div className={`${classes?.root} ${rootClass}`}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme?.direction === "rtl" ? "right" : "left"}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes?.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
            PaperProps={{
              style: {
                height: "100%"
              },
              className: "settings_drawer"
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css" className="left-drawer">
          {this.state.mobileOpen ? (
            <Drawer
              variant="permanent"
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes?.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          ) : null}
        </Hidden>
        <main className={`${classes?.content} responsive-main-container`}>
          <div className={classes?.toolbar} />
          {/* <Route exact path={`${match.url}/`} component={CompanyPage} /> */}
          <Route path={`${match.url}/shop/`} component={ShopPage} />
          {/* <Route path={`${match.url}/manage`} component={ManageEmployees} /> */}
          {/* <Route path={`${match.url}/company/`} component={CompanyPage} /> */}
          {/* <Route
            path={`${match.url}/master-catalog/`}
            component={MasterCatalogPage}
          /> */}
        </main>
      </div>
    );
  }
}

// ResponsiveDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };

export default connect(state => ({
  currentPageReducer: state.currentPageReducer,
  authReducer: state.authReducer,
  dispatch: state.dispatch,
}))(ResponsiveDrawer);
