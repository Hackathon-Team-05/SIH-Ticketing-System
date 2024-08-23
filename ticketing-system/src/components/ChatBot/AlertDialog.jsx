import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MicrophoneButton from "./MicrophoneButton.jsx";

const AlertDialog = ({isOpen, onClose}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Listening..."}</DialogTitle>
            <DialogContent style={{
                padding: '0 10px', display: 'flex', flexDirection: 'column'
                , justifyContent: 'center', alignItems: 'center'


            }}>
                <MicrophoneButton style={{color: 'black'}}/>
                <DialogContentText id="alert-dialog-description">
                    Please speak your message. The speech recognition process is active.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
