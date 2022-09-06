import React, { PureComponent } from 'react';
import { createGetUrl } from '../../utils/api';

export default class PDFViewer extends PureComponent {
    render () {

        const {
            pdfKey
        } = this.props;

        return (
            <object data={createGetUrl(pdfKey)} type="application/pdf" style={{width: '100%', height: 700}}></object> // eslint-disable-line
        )
    }
}