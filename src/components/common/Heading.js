import React, { PureComponent } from 'react';
import Text from './Text';

export default class Heading extends PureComponent {
    
    render () {

        const {
            children,
            ...restProps
        } = this.props

        return (
            <Text {...restProps} tag='h1'>{children}</Text>
        )
    }

}