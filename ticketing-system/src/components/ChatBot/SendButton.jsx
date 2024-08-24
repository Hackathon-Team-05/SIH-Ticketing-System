import React from 'react';
import './CircularButton.css';

const SendButton = () => {
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
                <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" />
            </svg>
        </button>
    );
};

export default SendButton;
