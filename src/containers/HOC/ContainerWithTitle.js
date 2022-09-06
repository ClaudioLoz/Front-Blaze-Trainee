import React, { PureComponent } from 'react';

import {
    connect
} from 'react-redux';

import { updateRouteTitle } from '../../actions/currentPage';

class ContainerWithTitle extends PureComponent {

    componentDidMount () {

        const { title } = this.props;

        this.props.dispatch(updateRouteTitle(title));

    }

    render () {

        const { WrappedComponent } = this.props; 
        
        return WrappedComponent

    }

}

const ContainerWithTitleConnected = connect(({dispatch}) => ({dispatch}))(ContainerWithTitle);


const ContainerWithTitleWrapper = (WrappedComponent, title) => props => {

    const isClockedIn = props.location && props.location.pathname && props.location.pathname.includes('/clocked_in') || false
    return <ContainerWithTitleConnected
        title={isClockedIn ? 'Clocked In' : title}
        WrappedComponent={<WrappedComponent {...props} />}
    /> 

}

export default ContainerWithTitleWrapper;