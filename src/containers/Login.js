import React, { PureComponent } from "react";
import { connect } from "react-redux";

import {Redirect} from 'react-router-dom'
import { Grid, Button, TextField } from "@material-ui/core";
import OnEvent from "react-onevent";

import {
  login2,
  switchApp,
  reviewCompanyAgreement2,
} from "../actions/auth";
import { openErrorMessage } from "../actions/message";

import ContainerWithTitle from "../containers/HOC/ContainerWithTitle";
import { appTargets } from "../utils/constants";
import validateInput from "../utils/validations/Login";

class Login extends PureComponent {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
      docuRes: {},
      toSwitch:false
    };
  }

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
    const { email, password } = this.state;

    const body = {
      email: email,
      password: password,
      appTarget: "AuthenticationApp",
    };

    this.props
      .dispatch(login2(body))
      .then((res) => {
        this.setState({toSwitch:true})
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
    const { email, password, errors,toSwitch } = this.state;
    
        if (toSwitch === true) {
                return <Redirect to="/switch" />;
            }

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
              />
              <div className="margin-top-medium">
                <Button
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
