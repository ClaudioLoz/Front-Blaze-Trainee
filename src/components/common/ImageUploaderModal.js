import React, {PureComponent} from 'react';
import Dropzone from 'react-dropzone';

// utils
import {removeExif, resizeImageBeforeUpload} from '../../utils/Image';

// local components
import ModalDialog from './ModalDialog';

class ImageUploderModal extends PureComponent {

    state = {
        open: false
    }

    componentWillReceiveProps(nextProps) {
        const {modal = true} = nextProps
        if (nextProps.open !== this.props.open && modal) {

            if (nextProps.open) {

                this.handleOpen()

            } else {

                this.handleClose()

            }

        }
    }

    handleOpen = () => {
        this.imageModal.handleClickOpen()
    };

    handleClose = () => {
        this.imageModal.handleClose()
    };

    onDrop = (files, rejected) => {
        const {
            accept = 'both', onError = () => {
            }
        } = this.props;
        if (!files.length) {
            return onError('Please upload a valid document or image')
        }

        if (rejected.length) {
            return onError('Please upload a valid file');
        }

        var valid = /(\.jpg|\.jpeg|\.png)$/i;
        var validPdf = /(\.pdf)$/i;
        var validCsv = /(\.csv)$/i;

        const file = files[0];

        switch (accept) {
            case 'document':
                if (!validPdf.exec(file.name)) {
                    return onError('Please upload a document')
                }
                break;
            case 'photo':
                if (!valid.exec(file.name)) {
                    return onError('Please upload an image')
                }
                break;
            case 'both':
                break;
            case 'document-csv':
                if (!validCsv.exec(file.name)) {
                    return onError('Please upload a csv document')
                }
                break;
            default:
                break;
        }

        if (validPdf.exec(file.name)) {
            if (file.size > 1024 * 1024 * 2) {
                return onError('Upload document less than 2 MB')
            }
        }

        if (!valid.exec(file.name)) {
            this.setState({
                file: file
            });

            this.props.onUpload(file)

        } else {

            removeExif(file)
                .then(newFile => {
                    this.setState({
                        newFile,
                        uploading: true,
                        percentage: 0
                    });

                    resizeImageBeforeUpload(newFile)
                        .then(resized => {
                            this.props.onUpload(resized);
                        })

                })

        }

    }

    render() {
        const {modal = true} = this.props
        return (
            <div>
                {modal ?
                    <ModalDialog ref={(c) => this.imageModal = c} hideSave onClose={this.props.handleClose}>
                        <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} style={{
                            minWidth: 200,
                            height: 200,
                            borderWidth: 2,
                            borderColor: 'transparent',
                            borderStyle: 'none',
                            borderRadius: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.03137254901960784)'
                        }}>
                            <div className="dz-default dz-message"><h1>Drop file here to upload</h1></div>
                        </Dropzone>
                    </ModalDialog>
                    :
                    <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} style={{
                        minWidth: 200,
                        height: 200,
                        borderWidth: 2,
                        borderColor: 'transparent',
                        borderStyle: 'none',
                        borderRadius: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.03137254901960784)'
                    }}>
                        <div className="dz-default dz-message"><h1>Drop file here to upload</h1></div>
                    </Dropzone>}
            </div>
        )

    }

}

export default ImageUploderModal;