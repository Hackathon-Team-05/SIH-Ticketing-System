import React from 'react';
import './CircularButton.css';


const SpeakerButton = () => {
    return (
        <button className="circular-button">
            <img src={"/assets/ChatBot/speaker.png"} alt="Speaker" width="19" height="19"/>

        </button>
    );
};

export default SpeakerButton;
