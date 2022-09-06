import React, { PureComponent } from 'react';

export default class Text extends PureComponent {

    render () {

        const {
            tag = 'p',
            size = 17,
            color,
            style = {},
            children,
            ...restProps
        } = this.props;

        const Tag = tag;

        const customStyle = {
            fontSize: size,
            color,
            ...style
        }

        return (
            <Tag
                style={customStyle}
                {...restProps}
            >
                {children}
            </Tag>
        )

    }

} 