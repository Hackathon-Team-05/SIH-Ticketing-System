import React from 'react';

function SubmitButton({onClick}) {


    return (
        <button onClick={onClick} style={{
            border: 'none', background: 'linear-gradient(135deg, #6a11cb, #2575fc)'
            , cursor: 'pointer', borderRadius: '50%'
        }}>
            <img src="/assets/ChatBot/arrow-right.png" alt="Button Image"
                 style={{width: '25px', height: '25px'}}/>
        </button>
    );
}

export default SubmitButton;
