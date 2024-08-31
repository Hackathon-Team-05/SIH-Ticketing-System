
export const startSpeechRecognition = (onResult, onError) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please try Chrome or Firefox.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onError(event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
    };

    recognition.start();
};
