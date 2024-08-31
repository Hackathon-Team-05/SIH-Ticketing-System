import React from 'react';
import './CircularButton.css';

const MicrophoneButton = () => {
    return (
        <button className="circular-button">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                width="24"
                height="24"
            >
                <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zM12 19a6 6 0 0 1-6-6h2a4 4 0 0 0 8 0h2a6 6 0 0 1-6 6z" />
            </svg>
        </button>
    );
};

export default MicrophoneButton;
