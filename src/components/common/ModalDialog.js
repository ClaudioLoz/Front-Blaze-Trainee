import React, { PureComponent } from 'react';

import {
    Button
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class ModalDialog extends PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    
    handleClickOpen = props => {
        if(this.props.onOpen) {
            this.props.onOpen(props);
        }
        this.setState({ open: true });
    };

    handleClose = () => {
        if(this.props.onClose) {
            this.props.onClose();
        }
        this.setState({ open: false });
    }; 

    render() {
        const {
            hideSave=false,
            confirmText="Save",
            cancelText="Cancel",
            cancelHidden=false,
            title="",
            onConfirm,
            maxWidth="sm",
            className='',
            paperStyle={},
            disableBackdropClick=false,
            rootClass
        } = this.props;
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth={maxWidth}
                    fullWidth
                    className={className}
                    classes={{ paper: rootClass }}
                    PaperProps={{style: paperStyle}}
                    disableBackdropClick={disableBackdropClick}
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent className="ModalContent dialog-content">
                        {
                            this.props.children
                        }
                    </DialogContent>
                    <DialogActions> 
                        <Button onClick={this.handleClose} className="button-white-and-red">
                        <span className="button-text">{cancelText}</span>
                        </Button>
                        {!hideSave ? <Button onClick={onConfirm}  className="button-blue-and-white" autoFocus>
                        <span className="button-text">{confirmText}</span>
                        </Button> : null}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}