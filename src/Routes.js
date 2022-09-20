import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import qs from "query-string";


import Login from "./containers/Login";
import SwitchApp from "./containers/SwitchApp";
import { isLoggedIn } from "./utils/api";
import ShopInfo from "./containers/Settings/Shop/ShopInfo";
import Settings from "./containers/Settings";

const checkAuth = () => {
  return isLoggedIn();
};
const params = qs.parse(window.location.search);


class Routes extends PureComponent {
  constructor(props) {
    super(props);
    // const searchParams = window.location.search;
    // const queryParams = qs.parse(searchParams);
    // const { token } = queryParams;

    // if (isLoggedIn()|| TEST ) {
    //   if (token || TEST ) {
    //     let tokenStr = token.split(" ").join("+");
    //     let newSession = window.localStorage.getObject("session");
    //     newSession.accessToken = tokenStr;
    //     window.localStorage.saveObject("session", newSession);
    //     this.props
    //       .dispatch(renewSession({ Authorization: `Token ${tokenStr}` }))
    //       .then((res) => {
    //         window.localStorage.setItem(
    //           "returnShopId",
    //           res.assignedShop && res.assignedShop.id
    //         );
    //       });
    //   }
    // }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/switch" component={SwitchApp} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/settings/shop" component={ShopInfo} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authReducer: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
