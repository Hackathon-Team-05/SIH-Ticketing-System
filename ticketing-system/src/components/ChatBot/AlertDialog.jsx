import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import MicrophoneButton from "./MicrophoneButton.jsx";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({isOpen, onClose, dialogTitle, dialogContent}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            TransitionComponent={Transition}
            keepMounted
            sx={{
                '& .MuiDialog-paper': {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: 0,
                    maxHeight: '50%',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent
                style={{
                    padding: '0 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <MicrophoneButton style={{color: 'black'}}/>
                <DialogContentText id="alert-dialog-description">
                    {dialogContent}
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
