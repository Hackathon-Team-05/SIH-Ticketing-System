import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import MicrophoneButton from "./MicrophoneButton.jsx";
import "./AlertDialog.css"

import PhoneNumberInput from "./PhoneNumberInput";
import SubmitButton from "./SubmitButton";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({hasInput, isOpen, onClose, dialogTitle, dialogContent}) => {
    const [_dialogContent, setDialogContent] = useState(dialogContent)
    const [_dialogTitle, setDialogTitle] = useState(dialogTitle)

    const [phone, setPhone] = useState('');

    const [number, showNumber] = useState(true);

    const [name, showName] = useState(false);
    const [personCount, showPersonCount] = useState(false);


    const handleSendOtp = () => {
        setDialogContent("OTP sent to your mobile number.")
        const formattedPhone = phone.replace(/\D/g, '');
        console.log("Extracted Mobile Number:", formattedPhone);
        showName(true)
        showNumber(false)
        showPersonCount(false)

        alert(`Phone number is: ${formattedPhone}`);

    };
    const handleSendName = () => {
        setDialogContent("Fill up the details to book tickets.")

        showName(false)
        showNumber(false)
        showPersonCount(true)


    };
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
            <DialogTitle id="alert-dialog-title">{_dialogTitle}</DialogTitle>
            <DialogContent
                style={{
                    padding: '0 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <DialogContentText id="alert-dialog-description">
                    {_dialogContent}
                </DialogContentText>
                {!hasInput && (<MicrophoneButton style={{color: 'black'}}/>
                )}
                {hasInput && (


                    <div>


                        {name && (<div className={"main-div"}>
                            <input value={"name"} placeholder={"Your name"}/>
                            <SubmitButton onClick={handleSendName}/>

                        </div>)


                        }
                        {number && (<div className={"main-div"}>

                            <PhoneNumberInput phone={phone} setPhone={setPhone}/>
                            <SubmitButton onClick={handleSendOtp}/>


                        </div>)}

                        {personCount && (<div className={"main-div"}>

                            <input placeholder={'person count'}/>
                            <SubmitButton onClick={handleSendOtp}/>


                        </div>)}


                    </div>


                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
        ;
};

export default AlertDialog;
