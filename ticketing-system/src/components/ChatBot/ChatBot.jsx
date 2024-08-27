import React, {useEffect, useRef, useState} from 'react';
import './ChatBot.css';
import 'antd/dist/reset.css';
import {Button} from "antd";
import MicrophoneButton from "./MicrophoneButton.jsx";
import SendButton from "./SendButton.jsx";
import {startSpeechRecognition} from './SpeechRecognition';

import {RingLoader} from 'react-spinners';
import {
    bookingProcessStart,
    bookingQuestions,
    notValidPrompts,
    ticketPrompt,
    ticketStructurePrompt,
    welcomeMsgs
} from './text_data.js';
import axios from "axios";
import nlp from 'compromise';
import SpeakerButton from "./SpeakerButton.jsx";
import {GENERAL_INQUIRY, GREETINGS, MUSEUM_TICKET_BOOK_QUERY} from "./query_constants";

let bookingIndex = 0;

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
    const [isBookingProcess, setIsBookingProcess] = useState(false);
    const [numberInput, setIsANumberInput] = useState(false);
    const [handleZerothQuestion, setHandleZerothQuestion] = useState(true);

    const [handleFirstQuestion, setHandleFirstQuestion] = useState(false);
    const [handleSecondQuestion, setHandleSecondQuestion] = useState(false);
    const [handleThirdQuestion, setHandleThirdQuestion] = useState(false);
    const [handleForthQuestion, setHandleForthQuestion] = useState(false);
    const [handleFifthQuestion, setHandleFifthQuestion] = useState(false);
    const [handleSixthQuestion, setHandleSixthQuestion] = useState(false);
    const [isOrganisation, setIsOrganisation] = useState(false);

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
        const welcomeMsg = welcomeMsgs;
        const randomIndex = Math.floor(Math.random() * welcomeMsg.length);
        const selectedWelcomeMessage = welcomeMsg[randomIndex];

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
            try {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.log('Text-to-speech is not supported in this browser.');

            }

        } else {
            console.log('Text-to-speech is not supported in this browser.');
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

    async function isQueryQuestion(input) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: input})
        };

        const response = await fetch('http://localhost:3000/classify', options);
        const data = await response.json();
        console.log(data)
        if (data.intent === GENERAL_INQUIRY) {

            console.log("This is a general inquiry")
            return true
        } else if (data.intent === GREETINGS) {
            console.log("This is a greeting")
            return false


        } else if (data.intent === MUSEUM_TICKET_BOOK_QUERY) {
            console.log("This is a book ticket command")

            setIsBookingProcess(true)


            return true
        }
        return false
    }

    function parseTicketInfo(input) {

        input = input.toLowerCase().trim();


        const patterns = {
            adults: /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:adult|adults|adult tickets)\b/,
            children: /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:child|childs|children|child tickets)\b/,
            foreigners: /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:foreigner|foreigners|foreigner tickets)\b/
        };


        const numberWords = {
            one: 1, two: 2, three: 3, four: 4, five: 5,
            six: 6, seven: 7, eight: 8, nine: 9, ten: 10
        };


        const convertWordToNumber = (word) => numberWords[word] || parseInt(word, 10);


        const extractNumbers = (pattern) => {
            const match = input.match(pattern);
            return match ? convertWordToNumber(match[1]) : 0;
        };

        const adults = extractNumbers(patterns.adults);
        const children = extractNumbers(patterns.children);
        const foreigners = extractNumbers(patterns.foreigners);


        if (adults === 0 && children === 0 && foreigners === 0) {
            return "Could not extract ticket numbers. Please provide the number of tickets for adults, children, and senior citizens.";
        }


        return {
            adults,
            children,
            foreigners
        };
    }

    function handleSendOtp(mobileNumber) {
        return true
    }

    function handleCheckOtp(otp) {
        return true
    }

    function extractNames(message) {
        const namePattern = /([A-Z][A-Z\s]+)(?:,\s?([A-Z][A-Z\s]+))?/

        const matches = message.match(namePattern);

        return matches ? matches : [];
    }

    const handleSendMessage = async () => {
            if (isBookingProcess === false) {
                setIsLoading(true);

                if (enterTicketNumber) {
                    if (checkValidTicketStructure(enterTicketNumber)) {
                        const notValidTicketIdPrompt = notValidPrompts;

                        // backend call
                    } else {
                        const ticketStructurePrompts = ticketStructurePrompt;
                        const randomIndex = Math.floor(Math.random() * ticketStructurePrompts.length);
                        const text = ticketStructurePrompts[randomIndex];
                        setConversation(prev => [...prev, {sender: 'bot', text: text}]);
                    }
                    setIsLoading(false);
                    return;
                }

                if (input.trim() === '') return;

                const newConversation = prev => [...prev, {sender: 'user', text: input}];
                setConversation(newConversation);

                if (await isQueryQuestion(input)) {
                    try {
                        const bookingProcessStartStatement = bookingProcessStart
                        const randomIndex = Math.floor(Math.random() * bookingProcessStartStatement.length);
                        const sentence = bookingProcessStartStatement[randomIndex];
                        setInput('')
                        const result = await axios.post('http://localhost:5000/chat', {"message": input});
                        setConversation(prev => [...prev, {sender: 'bot', text: result.data.response}, {
                            sender: 'bot',
                            text: sentence
                        }, {sender: 'bot', text: bookingQuestions[bookingIndex]}]);

                        // setIsANumberInput(true)
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
                                setConversation(prev => [...prev, {
                                    sender: 'bot',
                                    text: response.data[0].generated_text
                                }]);
                                setIsLoading(false);

                            })
                            .catch(error => {
                                console.error('Error making request:', error);
                                setConversation(prev => [...prev, {sender: 'bot', text: error}]);
                                setIsLoading(false);

                            });

                        setInput('');

                        setIsLoading(false);
                        console.log(inputText);


                    } catch (error) {
                        console.error('Error communicating with the API:', error);
                        setIsLoading(false);

                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: 'Sorry, I encountered an error. Please refresh the page.'
                        }]);
                    }
                }

            } else {
                setIsLoading(false);
                if (handleZerothQuestion) {
                    if (input.trim().toLowerCase() === "individual") {
                        bookingIndex = bookingIndex + 1

                        setIsOrganisation(false)
                        setInput('')
                        setHandleFirstQuestion(true)
                        setHandleThirdQuestion(false)
                        setHandleForthQuestion(false)
                        setHandleSecondQuestion(false)
                        setHandleFifthQuestion(false)
                        setHandleSixthQuestion(false)
                        setHandleZerothQuestion(false)
                        setConversation(prev => [...prev, {
                            sender: 'user',
                            text: input
                        }, {
                            sender: 'bot',
                            text: bookingQuestions[bookingIndex]
                        }]);
                    } else if (input.trim().toLowerCase() === "organisation") {
                        bookingIndex = bookingIndex + 1

                        setIsOrganisation(true)

                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: "Congo, you are eligible for a discount of 5%."
                        }, {
                            sender: 'bot',
                            text: bookingQuestions[bookingIndex]
                        }]);
                        setInput('')
                        setHandleFirstQuestion(true)
                        setHandleThirdQuestion(false)
                        setHandleForthQuestion(false)
                        setHandleSecondQuestion(false)
                        setHandleFifthQuestion(false)
                        setHandleSixthQuestion(false)
                        setHandleZerothQuestion(false)

                    } else {
                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: "I cannot understand. Please try again."
                        }]);
                    }


                } else if (handleFirstQuestion) {
                    setConversation(prev => [...prev, {
                        sender: 'user',
                        text: input
                    }])
                    if (input.trim().length === 10) {
                        if (handleSendOtp(input)) {
                            bookingIndex += 1

                            setInput('')
                            setHandleFirstQuestion(false)
                            setHandleThirdQuestion(false)
                            setHandleForthQuestion(false)
                            setHandleSecondQuestion(true)
                            setHandleFifthQuestion(false)
                            setHandleSixthQuestion(false)
                            setConversation(prev => [...prev, {
                                sender: 'bot',
                                text: bookingQuestions[bookingIndex]
                            }])
                        }

                    } else {
                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: 'This is not a valid phone number. Please message again.'
                        }])
                    }


                } else if (handleSecondQuestion) {
                    setConversation(prev => [...prev, {
                        sender: 'user',
                        text: input
                    }])
                    if (handleCheckOtp(input)) {
                        bookingIndex = bookingIndex + 1


                        setInput('')
                        setHandleFirstQuestion(false)
                        setHandleThirdQuestion(true)
                        setHandleForthQuestion(false)
                        setHandleSecondQuestion(false)
                        setHandleFifthQuestion(false)
                        setHandleSixthQuestion(false)
                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: 'OTP verified!'
                        }, {
                            sender: 'bot',
                            text: bookingQuestions[bookingIndex]
                        }])
                    } else {
                        setConversation(prev => [...prev, {
                            sender: 'bot',
                            text: 'OTP invalid!.'
                        }])
                    }


                } else if (handleThirdQuestion) {

                    setConversation(prev => [...prev, {sender: 'user', text: input}])

                    const json = parseTicketInfo(input)

                    console.log(json)
                    const adult = Number(json.adults)
                    const child = Number(json.children)
                    const foreigner = Number(json.foreigners)
                    const total = adult + child + foreigner
                    const formattedMessage = `You’ve selected ${total} tickets:${adult} adults, ${child} children, and ${foreigner} foreigners.
                Shall i proceed further?
                
`
                    setConversation(prev => [...prev, {sender: 'bot', text: formattedMessage}])
                    setInput('')
                    setHandleFirstQuestion(false)
                    setHandleThirdQuestion(false)
                    setHandleForthQuestion(true)
                    setHandleSecondQuestion(false)
                    setHandleFifthQuestion(false)
                    setHandleSixthQuestion(false)

                } else if (handleForthQuestion) {
                    setConversation(prev => [...prev, {sender: 'user', text: input}])

                    const response = await fetch(
                        "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
                        {
                            headers: {
                                Authorization: "Bearer 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",
                                "Content-Type": "application/json",
                            },
                            method: "POST",
                            body: JSON.stringify(input),
                        }
                    );
                    const result = await response.json();
                    let positiveScore = null;
                    let negativeScore = null;

                    result.forEach(innerArray => {
                        innerArray.forEach(item => {
                            if (item.label === "POSITIVE") {
                                positiveScore = item.score;
                            } else if (item.label === "NEGATIVE") {
                                negativeScore = item.score;
                            }
                        });
                    });
                    console.log("p:" + positiveScore)
                    console.log("n:" + negativeScore)

                    if (positiveScore >= negativeScore) {
                        bookingIndex = bookingIndex + 1

                        setHandleFirstQuestion(false)
                        setHandleThirdQuestion(false)
                        setHandleForthQuestion(false)
                        setHandleSecondQuestion(false)
                        setHandleFifthQuestion(true)
                        setHandleSixthQuestion(false)
                        console.log(extractNames(input))
                        setConversation(prev => [...prev, {sender: 'bot', text: bookingQuestions[bookingIndex]}])
                        setInput('')
                    } else {
                        setInput('')
                        setHandleFirstQuestion(false)
                        setHandleThirdQuestion(false)
                        setHandleForthQuestion(true)
                        setHandleSecondQuestion(false)
                        setHandleFifthQuestion(false)
                        setHandleSixthQuestion(false)
                        setConversation(prev => [...prev, {sender: 'bot', text: "Okay.Try again!"}])
                    }


                } else if (handleFifthQuestion) {

                    const names = extractNames(input.toUpperCase())
                    console.log(names)

                }


            }


        }
    ;

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
                            <button onClick={handleTicketStatus} className="shortcut_btn">Check ticket status
                            </button>
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
                                                        style={{cursor: 'pointer', marginLeft: '8px'}}/>}
                                                    style={{backgroundColor: '#ffffff', alignSelf: 'flex-end'}}
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
                                        type={numberInput ? "number" : "text"}
                                        value={input}
                                        min={0}
                                        onChange={handleInputChange}
                                    />
                                    {!isLoading && (
                                        <Button onClick={handleSendMessage}
                                                type="primary"
                                                shape="circle"
                                                icon={<SendButton style={{color: 'black'}}/>}
                                                style={{backgroundColor: '#ffffff', borderColor: '#007bff'}}
                                        />
                                    )}
                                    {isLoading && (<RingLoader size={32} color={"#8b00f6"}/>)}
                                </div>
                                <Button onClick={handleMicrophoneClick}
                                        type="primary"
                                        shape="circle"
                                        icon={<MicrophoneButton style={{color: 'black'}}/>}
                                        style={{backgroundColor: '#ffffff', borderColor: '#007bff'}}
                                />

                            </div>

                        </div>
                    </div>
                </div>
            </div>


        </div>

    );
};

export default Chatbot;
