/*eslint radix: ["error", "as-needed"]*/
import React, { PureComponent } from 'react';
import {
    Button
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment'
import { isLoggedIn } from '../../utils/api';

export default class TimeoutModal extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            minutesLeft: 20,
            secondsLeft: 0,
            intervalId: 0,
            time: (localStorage.getItem("time") && (moment().valueOf() + parseInt(localStorage.getItem("time")))) || (moment().valueOf() + 1200000)
        };
    }

    /* componentWillUnmount() {
        clearInterval(this.state.intervalId)
        if (this.state.time) {
            this.setState({ time: 0 })
            clearInterval(0)
        }
    } */

    timer = () => {
        if(!isLoggedIn()) {
            clearInterval(this.state.intervalId);
            return this.props.onCancel();
        }
        if(localStorage.getItem('time') == null) {
            this.setState({open: false})
        }
        let time = this.state.time - moment().valueOf()
        var seconds = Math.floor((time / 1000) % 60);
        var minutes = Math.floor((time / 1000 / 60) % 60);
        console.log(time, this.state.time, "time")
        if (time < 0) {
            clearInterval(this.state.intervalId)
            this.setState({ time: 0 }, () => this.props.onCancel())
        }

        if (time > 0 && document.getElementById("timer") != null) {
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            localStorage.setItem("time", ((minutes * 60 + seconds)*1000))
            document.getElementById("timer").innerHTML = `Time Left : 00:${minutes}:${seconds}`
        }

        let session = localStorage.getItem('session') || {}
        if (moment(session.expirationTime).diff(moment()) > 1200000) {
            clearInterval(this.state.intervalId)
            this.setState({ time: 0 }, () => this.props.onCancel())
        }

    }


    handleClickOpen = props => {
        this.setState({
            time: (localStorage.getItem("time") && (moment().valueOf() + parseInt(localStorage.getItem("time")))) || (moment().valueOf() + 12000000)
        }, () => {
            let session = localStorage.getItem('session') || {}
            if (session) {
                let intervalId = setInterval(this.timer, 1000)
                this.setState({ intervalId: intervalId });
            }
        });

        if (this.props.onOpen) {
            this.props.onOpen(props);
        }

        this.setState({ open: true });
    };

    handleClose = () => {

        clearInterval(this.state.intervalId)
        if (this.state.time) {
            this.setState({ time: 0 })
            clearInterval(0)
        }

        if (this.props.onClose) {
            this.props.onClose();
        }
        this.setState({ open: false });
    }

    render() {
        const {
            hideSave = false,
            confirmText = "Save",
            cancelText = "Cancel",
            title = "",
            onConfirm,
            maxWidth = "sm",
            className = '',
            paperStyle = {},
            disableBackdropClick = false,
        } = this.props;

        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={maxWidth}
                fullWidth
                className={className}
                PaperProps={{ style: paperStyle }}
                disableBackdropClick={disableBackdropClick}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                    <span id="timer" style={{ float: 'right' }}>  Time Left: 00:{this.state.minutesLeft < 10 ? `0${this.state.minutesLeft}` : this.state.minutesLeft}:{this.state.secondsLeft < 10 ? `0${this.state.secondsLeft}` : this.state.secondsLeft} </span>
                </DialogTitle>
                <DialogContent className="ModalContent dialog-content">
                    <div>
                        Your session is about to expire in 20 minutes. Please confirm if you want to renew this session or logout.
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCancel} color="primary">
                        {cancelText}
                    </Button>
                    {!hideSave ? <Button onClick={onConfirm} color="primary" autoFocus>
                        {confirmText}
                    </Button> : null}
                </DialogActions>
            </Dialog>
        )
    }
}