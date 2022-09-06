import React, { PureComponent, createRef } from "react";
import { connect } from "react-redux";
import { Grid, Button, TextField } from "@material-ui/core";
import OnEvent from "react-onevent";

import {
  login,
  login2,
  switchApp,
  reviewCompanyAgreement,
  reviewCompanyAgreement2,
} from "../actions/auth";
import { openErrorMessage } from "../actions/message";

import ContainerWithTitle from "../containers/HOC/ContainerWithTitle";
import SideCoverHOC from "./SideCover";
import { appTargets } from "../utils/constants";
import validateInput from "../utils/validations/Login";
// import { isLoggedIn, logOut } from "../utils/api";

class Login extends PureComponent {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
      showDocusignModal: false,
      docuRes: {},
      redirectApp: null,
    };
  }

  docusignNotificationModal = createRef();

  timeout = null;

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = () => {
    const { email, password } = this.state;

    this.setState({
      loading: true,
    });

    if (this.areCredentialsValid()) {
      this.props
        .dispatch(reviewCompanyAgreement2(email, password))
        .then((docuRes) => {
            console.log(docuRes);
            this.onDocusignContinue(false);
          
        });
    }
  };

  onDocusignContinue = (reload) => {
    const { email, password, redirectApp } = this.state;

    const body = {
      email: email,
      password: password,
      appTarget: "AuthenticationApp",
    };

    this.props
      .dispatch(login2(body))
      .then((res) => {
        

        let { employee = {}, assignedShop = {}, company = {} } = res;
        let host = "";
        this.setState({ loading: false });

        const { authReducer } = this.props;
        const { session = {} } = authReducer;
        const { employeeShops = [] } = session;

        const appTargetShops = [];

        Object.keys(appTargets).forEach((target) => {
          const shop = employeeShops.find((emp) => emp.appTarget === target);
          if (shop) {
            appTargetShops.push(shop);
          }
        });

        if (appTargetShops.length === 1) {
          const shop = appTargetShops[0];

          host = appTargets[shop.appTarget];
            this.props
              .dispatch(switchApp({ appName: shop.appTarget, shopId: shop.id }))
              .then((res) => {
                window.location.href = `/switch`;
                return;
              })
              .catch((err) => {
                console.log(err);
              });
        } else {
          if (reload) {
            window.location.reload();
          }
        }
      })
      .catch((err) =>
        this.setState({
          loading: false,
        })
      );
  };

  onError = (message) => this.props.dispatch(openErrorMessage(message));

  areCredentialsValid = () => {
    const { errors, isValid } = validateInput({
      email: this.state.email,
      password: this.state.password,
    });

    if (!isValid) this.setState({ errors });

    return isValid;
  };

  render() {
    const { email, password, errors } = this.state;

    return (
      <Grid justify="center" container xs={11} sm={7} md={11} lg={7}>
        <OnEvent enter={this.onSubmit}>
          {
            <div>
              <div>
                <h1 className="big-header slim-heading">Login</h1>
              </div>
              <TextField
                id="name"
                placeholder="Email"
                margin="normal"
                className="margin-top-medium"
                onChange={this.onChange}
                value={email}
                name="email"
                error={errors.email}
                helperText={errors.email}
                data-cy="input-email"
                inputProps={{
                  style: {
                    padding: "15px 20px",
                  },
                }}
                fullWidth
                InputProps={{
                  classes: {
                    underline: "thick-underlined",
                  },
                }}
              />
              <TextField
                inputProps={{
                  style: {
                    padding: "15px 20px",
                  },
                }}
                fullWidth
                InputProps={{
                  classes: {
                    underline: "thick-underlined",
                  },
                }}
                type="password"
                id="password"
                placeholder="Password"
                margin="normal"
                className="margin-top-medium"
                onChange={this.onChange}
                value={password}
                name="password"
                error={errors.password}
                helperText={errors.password}
                data-cy="input-password"
              />
              <div className="margin-top-medium">
                <Button
                  data-cy="btn-login"
                  onClick={this.onSubmit}
                  id="login-button"
                  variant="contained"
                >
                  Blaze Login
                </Button>
              </div>
            </div>
          }
        </OnEvent>
      </Grid>
    );
  }
}


const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
    };
  }
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    };
  }

export default connect(mapStateToProps,mapDispatchToProps)(ContainerWithTitle(Login, "BLAZE Login"));
