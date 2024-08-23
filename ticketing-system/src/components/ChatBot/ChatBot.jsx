import React, {useEffect, useRef, useState} from 'react';
import './ChatBot.css';
import 'antd/dist/reset.css';
import {Button} from "antd";
import MicrophoneButton from "./MicrophoneButton.jsx";
import SendButton from "./SendButton.jsx";
import {startSpeechRecognition} from './SpeechRecognition';
import AlertDialog from "./AlertDialog.jsx";
import {RingLoader} from 'react-spinners';
import {notValidPrompts, ticketPrompt, ticketStructurePrompt} from './text_data.js';
import axios from "axios";
import nlp from 'compromise';
import SpeakerButton from "./SpeakerButton.jsx";


const Chatbot = () => {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const messageContainerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hintText, setHintText] = useState("Type your message here...");
    const [enterTicketNumber, setEnterTicketNumber] = useState(false);


    // useEffect(() => {
    //     const fetchConversation = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/api/conversation');
    //             const data = await response.json();
    //             if (Array.isArray(data)) {
    //                 setConversationHistory(data); // Load the conversation history for context
    //             } else {
    //                 console.error('Expected an array but got:', data);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching conversation history:', error);
    //         }
    //     };
    //
    //     fetchConversation();
    // }, []);


    useEffect(() => {
        const welcomeMsgs = [
            "Welcome to the e-ticket system for Museums of India! I'm here to assist you with booking your tickets.",
            "Hello! Explore India's rich heritage with ease. I'm here to help you with your museum ticketing needs.",
            "Welcome! Discover the wonders of Indian museums. Let me assist you in booking your e-tickets.",
            "Hi there! I'm here to guide you through booking tickets for India's incredible museums.",
            "Greetings! Get ready to explore India's cultural treasures. I can help you with your e-ticket bookings.",
            "Hello and welcome! Let me assist you in securing your tickets for the Museums of India.",
            "Welcome aboard! I'm here to make your museum visit in India easy with seamless e-ticketing support."
        ];
        const randomIndex = Math.floor(Math.random() * welcomeMsgs.length);
        const selectedWelcomeMessage = welcomeMsgs[randomIndex];

        setWelcomeMessage(selectedWelcomeMessage);
    }, []);

    useEffect(() => {
        if (welcomeMessage) {
            setConversation(prev => [
                ...prev,
                {sender: 'bot', text: welcomeMessage}
            ]);
        }
    }, [welcomeMessage]);

    useEffect(() => {
        const messageContainer = messageContainerRef.current;
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [conversation]);

    const speakMessage = (message) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn('Text-to-speech is not supported in this browser.');
        }
    };
    const formatMessage = (message) => {
        let doc = nlp(message);
        return doc.text().replace(/^(.)/, (match) => match.toUpperCase());
    };
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    function checkValidTicketStructure(e) {
        // todo
        return false;
    }

    function isQueryQuestion(input) {
        return true
    }

    const handleSendMessage = async () => {
        setIsLoading(true);

        if (enterTicketNumber) {
            if (checkValidTicketStructure(enterTicketNumber)) {
                const notValidTicketIdPrompt = notValidPrompts;

                // backend call
            } else {
                const ticketStructurePrompts = ticketStructurePrompt;
                const randomIndex = Math.floor(Math.random() * ticketStructurePrompts.length);
                const text = ticketStructurePrompts[randomIndex];
                setConversation([...conversation, {sender: 'bot', text: text}]);
            }
            setIsLoading(false);
            return;
        }

        if (input.trim() === '') return;

        const newConversation = [...conversation, {sender: 'user', text: input}];
        setConversation(newConversation);

        if (isQueryQuestion(input)) {
            try {
                const result = await axios.post('http://localhost:5000/chat', {"message": input});
                setConversation([...newConversation, {sender: 'bot', text: result.data.response}]);
                setInput('')
                setIsLoading(false)


            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false)

            }
        } else {
            try {


                const apiUrl = "https://api-inference.huggingface.co/models/google/flan-t5-large";
                const headers = {
                    "Authorization": "Bearer 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"
                };

                const conversationHistory = [
                    "User:Keep in mind that you are a e-ticketing chat bot for National Museum tickets of India. " +
                    "Your name is Ticket Aarakshan Mitra. You help people to book their national museum tickets.",
                    "Assistant: Sure, I’d be happy to help!",

                ];


                const inputText = [...conversationHistory, `User: ${formatMessage(input)}\nAssistant:`].join("\n");

                const payload = {
                    inputs: inputText
                };


                axios.post(apiUrl, payload, {headers: headers})
                    .then(response => {
                        console.log(response.data);
                        setConversation([...newConversation, {sender: 'bot', text: response.data[0].generated_text}]);
                    })
                    .catch(error => {
                        console.error('Error making request:', error);
                        setConversation([...newConversation, {sender: 'bot', text: error}]);

                    });

                setInput('');

                setIsLoading(false);
                console.log(inputText);


            } catch (error) {
                console.error('Error communicating with the API:', error);
                setIsLoading(false);

                setConversation([...newConversation, {sender: 'bot', text: 'Sorry, I encountered an error.'}]);
            }
        }


    };

    function handleMicrophoneClick() {
        setIsOpen(true);
        startSpeechRecognition(
            (transcript) => {
                setInput(transcript);
                setIsOpen(false);
            },
            (error) => {
                console.error('Speech recognition error:', error);
                setIsOpen(false);
            }
        );
    }

    function handleTicketStatus() {
        const ticketPrompts = ticketPrompt;
        const randomIndex = Math.floor(Math.random() * ticketPrompts.length);
        const text = ticketPrompts[randomIndex];
        setEnterTicketNumber(true);
        setHintText("Enter the ticket number...");
        setConversation([...conversation, {sender: 'bot', text: text}]);
    }

    function handleMyBookings() {
        // todo
    }

    function handleCheckAvailability() {
        // todo
    }

    function handleRefundStatus() {
        // todo
    }

    // // Save conversation history to backend
    // useEffect(() => {
    //     const saveConversation = async () => {
    //         try {
    //             await fetch('http://localhost:3000/api/conversation', {
    //                 method: 'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify(conversation)
    //             });
    //         } catch (error) {
    //             console.error('Error saving conversation history:', error);
    //         }
    //     };
    //
    //     saveConversation();
    // }, [conversation]);

    return (
        <div className="main-container">
            <div className="flex-item-big">
                <div className="gradient-border">
                    <div className="gradient-border-up">
                        <div className={'ticket-title-div'}>
                            <img src="/assets/ChatBot/ncsm.png" width={100} height={100} alt="Logo 1"/>
                            <h3><p>Ticket Aarakshan Mitra</p>टिकट आरक्षण मित्र</h3>

                            <img src="/assets/ChatBot/logo-ministry.png" width={100} height={100} alt="Logo 2"/>
                        </div>
                        <div className={'shortcuts'}>
                            <button onClick={handleTicketStatus} className="shortcut_btn">Check ticket status</button>
                            <button onClick={handleMyBookings} className="shortcut_btn">My bookings</button>
                            <button onClick={handleCheckAvailability} className="shortcut_btn">Check Availability
                            </button>
                            <button onClick={handleRefundStatus} className="shortcut_btn">Refund Status</button>
                        </div>
                        <div className="scrollable">
                            <div className="message-container" ref={messageContainerRef}>
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender} message-anim`}>
                                        {msg.text}
                                        {msg.sender === 'bot' && (
                                            <Button onClick={() => {
                                                speakMessage(msg.text)
                                            }}
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<SpeakerButton

                                                        style={{cursor: 'pointer', marginLeft: '8px'}}
                                                    />}
                                                    style={{
                                                        backgroundColor: '#ffffff',
                                                        alignSelf:'flex-end'
                                                    }}
                                            />

                                        )}
                                    </div>

                                ))}
                            </div>

                            <div className={"chatbot-footer"}>
                                <div className="msgBtnBox">
                                    <input
                                        className="message-input"
                                        id="message-input"
                                        placeholder={hintText}
                                        type="text"
                                        value={input}
                                        onChange={handleInputChange}
                                    />
                                    {!isLoading && (
                                        <Button onClick={handleSendMessage}
                                                type="primary"
                                                shape="circle"
                                                icon={<SendButton style={{color: 'black'}}/>}
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#007bff'
                                                }}
                                        />
                                    )}
                                    {isLoading && (<RingLoader size={32} color={"#8b00f6"}/>)}
                                </div>
                                <Button onClick={handleMicrophoneClick}
                                        type="primary"
                                        shape="circle"
                                        icon={<MicrophoneButton style={{color: 'black'}}/>}
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: '#007bff'
                                        }}
                                />

                                <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
