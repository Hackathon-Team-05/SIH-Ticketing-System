import React from 'react';
import './CircularButton.css';
import speakerIcon from '../../../public/assets/ChatBot/speaker.png'; // Adjust the path according to your directory structure

const SpeakerButton = () => {
    return (
        <button className="circular-button">
            <img src={speakerIcon} alt="Speaker" width="19" height="19"/>

        </button>
    );
};

export default SpeakerButton;
