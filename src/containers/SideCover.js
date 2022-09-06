import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import Heading from '../components/common/Heading';
import {
    loginCover
} from '../assets'

class SideCover extends Component {

    render () {

        const {
            WrappedComponent = null,
            heading="BLAZE",
            ...restProps
        } = this.props;
        
        return (

            <Grid container>
                <Grid className="auth-bg" item lg={6} md={6} sm={12} xs={12}
                    style={{
                        backgroundImage: `url(${loginCover})`,
                        backgroundSize: 'cover'
                    }}
                >
                    <div className="full-height full-width"
                        style={{
                            backgroundColor: 'rgba(70, 196, 233, 0.5)'
                        }}
                    >
                        <Grid container className="center-aligned-child full-height">
                            <Grid className="leftBlockLogin" item xs={11} sm={12} md={12} lg={12}>
                                <Heading  size={90} className="margin-top-none text-center">{heading}</Heading>
                                {/* <Text tag='p'>Premiere marijuana software designed and used by industry experts. User tested, industry adored, and growing more and more every day. Increase your sales, customer retention, and improve your service quality overnight</Text> */}
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Grid container className="center-aligned-child full-height">
                        <WrappedComponent {...restProps} />
                    </Grid>
                </Grid>
            </Grid>

        )

    }

}

const SideCoverHOC = WrappedComponent => (props) => <SideCover WrappedComponent={WrappedComponent} {...props} />

export default SideCoverHOC;