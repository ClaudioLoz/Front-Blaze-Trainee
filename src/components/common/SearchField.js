import React from 'react';
import { FormControl, Input } from '@material-ui/core';
import { throttle } from '../../utils/common'

export default class SearchField extends React.Component {

    searchTimeout = null

    onChange = (e) => {
        this.props.onChange(e);
        const { value } = e.target;
        this.searchTimeout = throttle(() => this.props.onSearch(value), 500, this.searchTimeout)
    }

    render() {
        const {
            placeholder = 'Search.....',
            width = false
        } = this.props;

        return (
            <FormControl className="search-field">
                <Input
                    onKeyPress={() => { }}
                    type="text"
                    fullWidth={width}
                    onChange={this.onChange}
                    className="form-control cus-border-bottom"
                    placeholder={placeholder}
                    onSearch={this.props.onSearch}
                />
            </FormControl>
        )
    }
}

