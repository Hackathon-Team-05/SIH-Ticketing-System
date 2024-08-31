import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LanguageChooser from "./LanguageChooser";

function AlertDialog({open, onClose, onLanguageChange}) {
    function onSelectLanguage(selectedLanguage) {
        onLanguageChange(selectedLanguage);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Change Language"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You can change the language of the reply by clicking the languages below.
                </DialogContentText>

                <LanguageChooser onSelectLanguage={onSelectLanguage}/>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
