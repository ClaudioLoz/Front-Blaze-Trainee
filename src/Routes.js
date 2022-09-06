import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import qs from "query-string";

import { renewSession } from "./actions/auth";

import Login from "./containers/Login";
import SwitchApp from "./containers/SwitchApp";
import { isLoggedIn } from "./utils/api";
// import Settings from "./containers/Settings";

const checkAuth = () => {
  return isLoggedIn();
};
const TEST = false;
const params = qs.parse(window.location.search);
const current = params["current"] || "";

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const { match = {} } = props;
      const { params = {} } = match;

      if (window.Appcues) {
        window.Appcues.start();
        window.Appcues.page();
      }

      if (checkAuth()) {
        return (
          <Redirect
            to={{ pathname: `/${current ? "settings/shop" : "switch"}` }}
          />
        );
      } else {
        return <Component {...props} />;
      }
    }}
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (window.Appcues) {
        window.Appcues.start();
        window.Appcues.page();
      }
      return checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: `/` }} />
      );
    }}
  />
);

const RedirectTo = (path) => (props) => <Redirect to={path} />;

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
          {/* <PrivateRoute path="/settings" component={Settings} /> */}
          {/* <PublicRoute component={RedirectTo("/")} /> */}
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
