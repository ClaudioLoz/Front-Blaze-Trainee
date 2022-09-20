import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';


import {openErrorMessage} from '../../actions/message';


import EditableInputHOC from '../../containers/HOC/EditableInputHOC';
import {NoImagePlaceholder} from '../../assets';

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