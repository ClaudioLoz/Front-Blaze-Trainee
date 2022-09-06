import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, IconButton } from '@material-ui/core';
import { logOut, getSession } from '../../utils/api';
import { switchApp } from '../../actions/auth';
//import _ from 'lodash';
//import { distributionLogo, retailLogo, growLogo } from '../../assets';

import {
    PowerSettingsNew as PowerSettingsNewIcon
} from '@material-ui/icons';
import { appTargets } from '../../utils/constants';

class NavHeader extends PureComponent {
    state = {
        dropdown: false
    };

    componentDidMount() {
        window.addEventListener('click', () => {
            if (this.state.dropdown) {
                this.setState({ dropdown: false })
            }
        });
    }

    logout = () => {
        logOut()
            .then(() => {
                this.props.history.push('/')
            })
    }

    goTo = name => e => {
        this.props.history.push(name)
    }

    toggleDropdown = (e) => {
        e.stopPropagation();
        this.setState({ dropdown: !this.state.dropdown });
    }

    findShop = (id, shops) => {
        const shop = shops.find((item) => item.id === id) || {};
        return shop.name || '';
    }

    handleChange = (obj) => {
        this.setState({ dropdown: false });
        const user = getSession();
        let host = '';

        let { assignedShop } = this.props;
        if (obj.id === assignedShop.id) {
            return;
        }

        host = appTargets[obj.appTarget];

        this.props.dispatch(switchApp({ appName: 'Retail', shopId: obj.id }))
            .then(res => {
                //console.log(obj, 'host')
                window.location.href = `${host}/login?token=${user.accessToken}&shop=${obj.id}`;
            })
            .catch(err => {
                //console.log(err);
            });
    }

    render() {
        const { shops = [] } = this.props;
        /* const images = {
            Distribution: distributionLogo,
            Retail: retailLogo,
            Grow: growLogo
        }; */

        const shopDetails = {};

        shops && shops.length && shops.forEach((item, i) => {
            if (shopDetails[item.appTarget]) {
                shopDetails[item.appTarget].push(item);
            } else {
                shopDetails[item.appTarget] = [item];
            }
        });
        return (
            <div id="nav-header">
                <Button onClick={this.goTo('settings/shop')} id="logOut-button" style={{ float: 'left' }}>
                    <i className="material-icons">
                        settings
                    </i>
                </Button>
                {/* <div className="shopDropdown" onClick={this.toggleDropdown}>
                  <div>
                    <span>{this.findShop(assignedShop.id, shops)}<i className="material-icons" style={{ float: 'right' }}>keyboard_arrow_down</i></span>     
                  </div>
                  {this.state.dropdown?
                    <Paper onClick={(e) => e.stopPropagation()} className="arrow_box dropdownInner">
                        <div className="main_menu">
                            <div className="flex-Grid">
                                {_.map(shopDetails).map((item, key) => <li><span><img src={images[Object.keys(shopDetails)[key]]}/></span>
                                <ul>
                                    <h3>BLAZE {Object.keys(shopDetails)[key]}</h3>
                                    {item.map(menu => <li className="shopElement" onClick={this.handleChange.bind(this, menu)}><span >{menu.id == assignedShop.id ? <b style={{color: 'orange'}}>{menu.name}</b> : menu.name }</span></li>)}
                                </ul>
                                </li>)}
                            </div>
                        </div>
                  </Paper>:null}
                </div> */}

                <div className="welcomeGroup"><div className="logouticon">
                    <IconButton
                        color="inherit"
                        aria-label="log out"
                        onClick={this.logout}
                        className="float-right"
                        id="logOut-button"
                    >
                        <PowerSettingsNewIcon />
                    </IconButton>
                </div>
                </div>
            </div>
        )
    }
}

export default withRouter(NavHeader);