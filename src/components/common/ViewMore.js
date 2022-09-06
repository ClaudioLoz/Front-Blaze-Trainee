import React, { Component } from 'react';

class ViewMore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    toggleView = () => {
        this.setState({ show: !this.state.show });
    }

    getData = () => {
        let { text } = this.props;
        text = text || '';
        
        if(text.length <= 20) {
            return text;
        } else {
            return <span>{this.state.show?text:text.substr(0, 20) + '...'} <a href="javascript:void(0);" onClick={this.toggleView} style={{textDecoration: 'none', color: '#1cc4e8'}}>View {this.state.show?'Less': 'More'}</a></span> // eslint-disable-line
        }
    }

    render() {
        return this.getData();
    }
}

export default ViewMore;