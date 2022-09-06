import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';

// api hits
import {uploadAssetAPI} from '../../api/assets';

// utils
import {addMessageCurry} from '../../utils/api';

// local components
import ImageUploderModal from '../common/ImageUploaderModal';
import EditableInputHOC from '../../containers/HOC/EditableInputHOC';
import {getAssetType} from '../../utils/Image';
import {NoImagePlaceholder} from '../../assets';
import {openErrorMessage} from '../../actions/message';

class Uploader extends React.Component {

    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    onUpload = (file) => {

        const {imageUploadAPI} = this.props;
        const type = getAssetType(file.name);

        const apiToHit = imageUploadAPI || uploadAssetAPI;

        this.handleClose()

        addMessageCurry(apiToHit(file, type), this.props.dispatch)
            .then(photo => {
                if (this.props.onUpload) {
                    this.props.onUpload(photo)
                }
            })

    }

    onError = (error) => {
        this.props.dispatch(openErrorMessage(error))
    }

    render() {

        const {src, hideImage = false, hideButton} = this.props;
        return (

            <Fragment>
                {!hideImage &&
                <ImagePreview src={src}/>}
                {!hideButton && <Button onClick={this.handleOpen} className="button-blue-and-white"><span className="button-text">Upload</span></Button>}  
                <ImageUploderModal
                    open={this.state.open}
                    onUpload={this.onUpload}
                    handleClose={this.handleClose}
                    accept='photo'
                    onError={this.onError}
                />    
            </Fragment>

        )

    }

}

export const ImageUploader = connect(({dispatch}) => ({dispatch}))(Uploader);

export class ImagePreview extends PureComponent {

    render() {

        const {src} = this.props;
        return (
            <div
                style={{
                    width: 100,
                    height: 100
                }}
                className="margin-bottom-small"
            >
                <img
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                    src={src}
                    alt=""
                    onError={(e) => {
                        e.target.src = NoImagePlaceholder
                    }}
                />
            </div>
        )
    }

}

export const EditableImageUploader = EditableInputHOC(ImageUploader);