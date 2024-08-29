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
import {GENERAL_INQUIRY, MUSEUM_TICKET_BOOK_QUERY} from "./query_constants";
import LanguageButton from "./LanguageButton";
import AlertDialog from "./AlertDialog";

let bookingIndex = 0;
let backendPort = 8080
let chatbotBackend = 5000
const GENERAL_INQUIRY_ = 0
const TICKET_BOOK_QUERY_ = 1
const GREETINGS_ = 2
let isBookingProcessStarted = false

const Chatbot = () => {
    const [organisationDiscount, setOrganisationDiscount] = useState(5)
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const messageContainerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hintText, setHintText] = useState("Type your message here...");
    const [enterTicketNumber, setEnterTicketNumber] = useState(false);

    const [numberInput, setIsANumberInput] = useState(false);

    const [hasMuseum, setHasMuseum] = useState(false);
    const [fetchMuseumId, setFetchMuseumId] = useState(false);
    const [checkEventAdded, setTicketEventAdded] = useState(false);
    const [paymentCheckout, setAskedForPaymentCheckout] = useState(false);

    const [museumName, SetMuseumName] = useState('');

    const [handleZerothQuestion, setHandleZerothQuestion] = useState(true);
    const [handleFirstQuestion, setHandleFirstQuestion] = useState(false);
    const [handleSecondQuestion, setHandleSecondQuestion] = useState(false);
    const [handleThirdQuestion, setHandleThirdQuestion] = useState(false);
    const [handleForthQuestion, setHandleForthQuestion] = useState(false);
    const [handleFifthQuestion, setHandleFifthQuestion] = useState(false);
    const [handleSixthQuestion, setHandleSixthQuestion] = useState(false);
    const [handleSeventhQuestion, setHandleSeventhQuestion] = useState(false);

    const [handleEighthQuestion, setHandleEighthQuestion] = useState(false);
    const [isOrganisation, setIsOrganisation] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [noOfChildren, setNoOfChildren] = useState(0);
    const [noOfAdults, setNoOfAdults] = useState(0);
    const [noOfForeigners, setNoOfForeigners] = useState(0);
    const [adultNames, setAdultNames] = useState([]);
    const [childNames, setChildNames] = useState([]);
    const [foreignerNames, setForeignerNames] = useState([]);
    const [totalTickets, setTotal] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [languageCode, setLanguageCode] = useState('en');

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const onLanguageChange = async (language) => {
        setLanguageCode(language)
        console.log(language)
    }

    async function translateIfRequired(text) {
        if (languageCode === 'en') {
            return text
        }
        try {
            const RAPIDAPI_KEY = '22560c3fa1mshbed057c1c31ce39p1bcdedjsn5069492c2377';
            const RAPIDAPI_HOST = 'microsoft-translator-text.p.rapidapi.com';
            const response = await axios({
                method: 'POST',
                url: `https://${RAPIDAPI_HOST}/translate`,
                params: {
                    'api-version': '3.0',
                    from: 'en',
                    to: languageCode,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST,
                },
                data: [{
                    text: text
                }]
            });

            const translation = response.data[0].translations[0].text;
            return translation;
        } catch (error) {
            console.error('Error translating text:', error);
            return text;
        }
    }

    useEffect(() => {
        const setWelcomeMsg = async () => {
            const welcomeMsg = welcomeMsgs;
            const randomIndex = Math.floor(Math.random() * welcomeMsg.length);
            const selectedWelcomeMessage = welcomeMsg[randomIndex];
            const translatedWelcome = await translateIfRequired(selectedWelcomeMessage);
            setWelcomeMessage(translatedWelcome);
        };
        setWelcomeMsg();
    }, []);

    useEffect(() => {
        if (welcomeMessage) {
            updateConversation({sender: 'bot', text: welcomeMessage});
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


        const response = await axios.post(`http://localhost:${chatbotBackend}/classify`, {text: input})
        const data = await response.data;
        console.log(data)
        if (data.intent === "GENERAL_INQUIRY") {
            return GENERAL_INQUIRY_
        } else if (data.intent === "MUSEUM_TICKET_BOOK_QUERY") {
            isBookingProcessStarted = true
            return TICKET_BOOK_QUERY_
        } else {
            return GREETINGS_
        }
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

    function extractIdsFromString(message) {
        const namePattern = /\b\d+(?:,\d+)*\b/

        const matches = message.match(namePattern);

        return matches ? matches : [];
    }

    const updateConversation = async (newMessage) => {
        const translatedText = await translateIfRequired(newMessage.text);
        setConversation(prev => [...prev, {...newMessage, text: translatedText}]);
    };

    const handleSendMessage = async (message) => {
        setInput('')
        setIsLoading(true)
        if (message.trim() === '') return;
        if (isBookingProcessStarted === false) {
            if (enterTicketNumber) {
                if (checkValidTicketStructure(enterTicketNumber)) {
                    const notValidTicketIdPrompt = notValidPrompts;
                    // backend call
                } else {
                    const ticketStructurePrompts = ticketStructurePrompt;
                    const randomIndex = Math.floor(Math.random() * ticketStructurePrompts.length);
                    const text = ticketStructurePrompts[randomIndex];
                    await updateConversation({sender: 'bot', text: text});
                }
                setIsLoading(false);
                return;
            }
            await updateConversation({sender: 'user', text: message});
            const query = await isQueryQuestion(message)

            if (query === TICKET_BOOK_QUERY_) {
                try {
                    console.log("This is a ticket book intent")
                    const bookingProcessStartStatement = bookingProcessStart
                    const randomIndex = Math.floor(Math.random() * bookingProcessStartStatement.length);
                    const sentence = bookingProcessStartStatement[randomIndex];
                    setInput('')

                    await updateConversation({sender: 'bot', text: sentence});
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});

                    setIsLoading(false)
                } catch (error) {
                    console.error('Error:', error);
                    setIsLoading(false)
                }
            } else if (query === GENERAL_INQUIRY_) {
                console.log("This is a general inquiry intent")

                const result = await axios.post(`http://localhost:${chatbotBackend}/chat`, {"message": message});
                await updateConversation({sender: 'bot', text: result.data.response});
                setIsLoading(false)
            } else if (query === GREETINGS_) {
                console.log("This is a greetings intent")

                try {
                    const apiUrl = "https://api-inference.huggingface.co/models/google/flan-t5-large";
                    const headers = {
                        "Authorization": "Bearer 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"
                    };

                    const conversationHistory = [
                        "User:Keep in mind that you are a e-ticketing chat bot for National Museum tickets of India. " +
                        "Your name is SangraM AI. You help people to book their national museum tickets.",
                        "Assistant: Sure, I'd be happy to help!",
                    ];

                    const inputText = [...conversationHistory, `User: ${formatMessage(message)}\nAssistant:`].join("\n");

                    const payload = {
                        inputs: inputText
                    };

                    const response = await axios.post(apiUrl, payload, {headers: headers});
                    await updateConversation({sender: 'bot', text: response.data[0].generated_text});
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error communicating with the API:', error);
                    setIsLoading(false);
                    await updateConversation({
                        sender: 'bot',
                        text: 'Sorry, I encountered an error. Please refresh the page.'
                    });
                }
            } else {
                await updateConversation({
                    sender: 'bot',
                    text: "I'm sorry, I didn't quite get that. Could you please rephrase your question or provide more details?"
                });
                setIsLoading(false)
            }
        } else {
            setIsLoading(false);
            await updateConversation({sender: 'user', text: message});

            if (handleZerothQuestion) {
                if (message.trim().toLowerCase() === "individual") {
                    bookingIndex = bookingIndex + 1
                    setIsOrganisation(false)
                    setInput('')
                    setHandleZerothQuestion(false)
                    setHandleFirstQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else if (message.trim().toLowerCase() === "organisation") {
                    bookingIndex = bookingIndex + 1
                    setIsOrganisation(true)
                    await updateConversation({
                        sender: 'bot',
                        text: `Congratulations, you are eligible for a discount of ${organisationDiscount}%.`
                    });
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setInput('')
                    setHandleZerothQuestion(false)
                    setHandleFirstQuestion(true)
                    setIsLoading(false);

                } else {
                    await updateConversation({sender: 'bot', text: "I cannot understand. Please try again."});
                    setIsLoading(false);

                }
            } else if (handleFirstQuestion) {
                if (message.trim().length === 10) {
                    if (handleSendOtp(message)) {
                        setPhoneNumber(message)
                        bookingIndex += 1
                        setInput('')
                        setHandleFirstQuestion(false)
                        setHandleSecondQuestion(true)
                        await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                        setIsLoading(false);

                    }
                } else {
                    await updateConversation({
                        sender: 'bot',
                        text: 'This is not a valid phone number. Please message again.'
                    });
                    setIsLoading(false);

                }
            } else if (handleSecondQuestion) {
                if (handleCheckOtp(message)) {
                    bookingIndex = bookingIndex + 1
                    setInput('')
                    setHandleSecondQuestion(false)
                    setHandleThirdQuestion(true)
                    await updateConversation({sender: 'bot', text: 'OTP verified!'});
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else {
                    await updateConversation({sender: 'bot', text: 'OTP invalid!.'});
                    setIsLoading(false);

                }
            } else if (handleThirdQuestion) {
                const json = parseTicketInfo(message)
                console.log(json)
                const adult = Number(json.adults)
                const child = Number(json.children)
                const foreigner = Number(json.foreigners)
                const total = adult + child + foreigner
                const formattedMessage = `You've selected ${total} tickets:${adult} adults, ${child} children, and ${foreigner} foreigners.
                Shall i proceed further?`

                setNoOfChildren(child)
                setNoOfAdults(adult)
                setNoOfForeigners(foreigner)
                setTotal(total)
                await updateConversation({sender: 'bot', text: formattedMessage});
                setInput('')
                setHandleThirdQuestion(false)
                setHandleForthQuestion(true)
                setIsLoading(false);

            } else if (handleForthQuestion) {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(message),
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
                    setHandleForthQuestion(false)
                    setHandleFifthQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setInput('')
                    setIsLoading(false);

                } else {
                    setInput('')
                    setHandleForthQuestion(true)
                    setHandleFifthQuestion(false)
                    await updateConversation({sender: 'bot', text: "Okay.Try again!"});
                    setIsLoading(false);

                }
            } else if (handleFifthQuestion) {
                const finalNamesAdult = []
                const names = extractNames(message.toUpperCase())
                for (let i = 1; i < names.length; i++) {
                    try {
                        finalNamesAdult.push(names[i].trim())
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (finalNamesAdult.length === noOfAdults) {
                    bookingIndex = bookingIndex + 1
                    setAdultNames(finalNamesAdult)
                    console.log(finalNamesAdult)
                    setInput('')
                    setHandleFifthQuestion(false)
                    setHandleSixthQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else if (message.trim().toLowerCase() === "skip") {
                    bookingIndex = bookingIndex + 1
                    setInput('')
                    setHandleFifthQuestion(false)
                    setHandleSixthQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else {
                    await updateConversation({
                        sender: 'bot',
                        text: `You have two give ${noOfAdults} names. But you have given ${finalNamesAdult.length} names. Please try again.`
                    });
                    setIsLoading(false);

                }
            } else if (handleSixthQuestion) {
                bookingIndex = bookingIndex + 1
                const finalNamesChild = []
                const names = extractNames(message.toUpperCase())
                for (let i = 1; i < names.length; i++) {
                    try {
                        finalNamesChild.push(names[i].trim())
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (finalNamesChild.length === noOfChildren) {
                    setChildNames(finalNamesChild)
                    console.log(finalNamesChild)
                    setInput('')
                    setHandleSixthQuestion(false)
                    setHandleSeventhQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else if (message.trim().toLowerCase() === "skip") {
                    bookingIndex = bookingIndex + 1
                    setInput('')
                    setHandleSixthQuestion(false)
                    setHandleSeventhQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else {
                    await updateConversation({
                        sender: 'bot',
                        text: `You have two give ${noOfChildren} names. But you have given ${finalNamesChild.length} names. Please try again.`
                    });
                    setIsLoading(false);

                }
            } else if (handleSeventhQuestion) {
                const finalNamesForeigners = []
                const names = extractNames(message.toUpperCase())
                for (let i = 1; i < names.length; i++) {
                    try {
                        finalNamesForeigners.push(names[i].trim())
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (finalNamesForeigners.length === noOfForeigners) {
                    bookingIndex = bookingIndex + 1
                    setForeignerNames(finalNamesForeigners)
                    console.log(finalNamesForeigners)
                    setInput('')
                    setHandleSeventhQuestion(false)
                    setHandleEighthQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else if (message.trim().toLowerCase() === "skip") {
                    bookingIndex = bookingIndex + 1
                    setInput('')
                    setHandleSeventhQuestion(false)
                    setHandleEighthQuestion(true)
                    await updateConversation({sender: 'bot', text: bookingQuestions[bookingIndex]});
                    setIsLoading(false);

                } else {
                    await updateConversation({
                        sender: 'bot',
                        text: `You have two give ${noOfForeigners} names. But you have given ${finalNamesForeigners.length} names. Please try again.`
                    });
                    setIsLoading(false);

                }
            } else if (handleEighthQuestion) {
                setInput('')
                const city = message.trim().toLowerCase()
                const statement = `List the museums which are situated in the city ${city} with their respective museum id.`
                const result = await axios.post(`http://localhost:${chatbotBackend}/chat`, {"message": statement});
                await updateConversation({sender: 'bot', text: result.data.response});
                await updateConversation({sender: 'bot', text: "Reply the museum id, that you want to book."});
                setHandleEighthQuestion(false)
                setFetchMuseumId(true)
                console.log(result.data.response)
                setIsLoading(false);

            } else if (fetchMuseumId) {
                const museumId = message.trim()
                const result = await axios.get(`http://localhost:${backendPort}/api/fetch_price/${museumId}`)


                const statement = `Is there any event going on for the museum id ${museumId} ?`
                const requestQueryEvents = await axios.post(`http://localhost:${chatbotBackend}/chat`, {"message": statement});
                const answer = await requestQueryEvents.data.response;
                ////////////////////////////////////
                const requestSentiment = await fetch(
                    "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(answer),
                    }
                );
                const resultSentiment = await requestSentiment.json();
                let positiveScore = null;
                let negativeScore = null;


                let adultPrice = null
                let childPrice = null
                let foreignerPrice = null
                if (result.data.price_adult != null) {
                    adultPrice = result.data.price_adult
                }
                if (result.data.price_child != null) {
                    childPrice = result.data.price_child
                }
                if (result.data.price_foreigner != null) {
                    foreignerPrice = result.data.price_foreigner
                }

                const totalAdultPrice = Number(adultPrice) * Number(noOfAdults)
                const totalChildPrice = Number(childPrice) * Number(noOfChildren)
                const totalForeignerPrice = Number(foreignerPrice) * Number(noOfForeigners)
                let totalMoney = totalAdultPrice + totalChildPrice + totalForeignerPrice

                if (isOrganisation) {
                    totalMoney = totalMoney - ((organisationDiscount / 100) * totalMoney)
                }

                await updateConversation({
                    sender: 'bot', text: `
                Here are the details for the pricing of the tickets for ${result.data.name}:
                    (1). Adult: ${adultPrice != null ? adultPrice : "Not specified."}
                    (2). Child: ${childPrice != null ? childPrice : "Not specified."}
                    (3). Foreigner: ${foreignerPrice != null ? foreignerPrice : "Not specified."}
                `
                });

                await updateConversation({
                    sender: 'bot', text: `
                Your total bill amount is ${totalMoney}.
                Number of adult tickets is ${noOfAdults} which adds up to ${totalAdultPrice}.
                Number of child tickets is ${noOfChildren} which adds up to ${totalChildPrice}.
                Number of foreigner tickets is ${noOfForeigners} which adds up to ${totalForeignerPrice}.
                `
                });

                if (totalMoney === 0) {
                    await updateConversation({
                        sender: 'bot', text: `Free Free Free !!! You do not need to get a ticket for ${result.data.name}
                    There is a free entry. Booking process closed.
                    `
                    });
                    isBookingProcessStarted = false
                    setIsLoading(false);

                } else {


                    resultSentiment.forEach(innerArray => {
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
                    await updateConversation({
                        sender: 'bot', text: `
                ${isOrganisation ? `Additional ${organisationDiscount}% discount is added for your organisation.` : ""}`
                    });

                    if (positiveScore >= negativeScore) {
                        const statement = `List the events going on for the museum id ${museumId} with their event ids?`
                        const requestListOfEvents = await axios.post(`http://localhost:${chatbotBackend}/chat`, {"message": statement});
                        const eventListResult = await requestListOfEvents.data.response;

                        await updateConversation({sender: 'bot', text: 'There are events going on for this museum.'})
                        await updateConversation({sender: 'bot', text: eventListResult})


                        await updateConversation({
                            sender: 'bot',
                            text: 'Reply the event id/ids to book. Reply skip to proceed to payments.'
                        })
                        setFetchMuseumId(false)
                        setTicketEventAdded(true)
                        setAskedForPaymentCheckout(false)
                        setIsLoading(false);


                    } else {
                        setFetchMuseumId(false)
                        setAskedForPaymentCheckout(true)
                        setTicketEventAdded(false)
                        await updateConversation({
                            sender: 'bot',
                            text: 'Proceed to payments?'
                        })
                        setIsLoading(false);

                    }


                }
            } else if (checkEventAdded) {
                if (message.trim() === "skip") {


                    await updateConversation({
                        sender: 'bot',
                        text: "Do you really want to skip the event booking for this museum?"
                    });
                    setFetchMuseumId(false)
                    setTicketEventAdded(false)
                    setAskedForPaymentCheckout(true)
                    setIsLoading(false);

                } else {


                    const eventIds = extractIdsFromString(message.trim())
                    const prices = {}
                    // handle the loop to add pricing


                    const json = {events: eventIds};
                    for (let i = 0; i < eventIds.length; i++) {
                        const request = await axios.get(`http://localhost:${backendPort}/api/fetch_price/event/${eventIds[i]}`);

                        const result = await request.data
                        prices[eventIds[i]] = result.price
                        console.log(result)

                    }
                    console.log(prices)


                    await updateConversation({
                        sender: 'bot',
                        text: "Proceed to payments?"
                    });
                    setFetchMuseumId(false)
                    setTicketEventAdded(false)
                    setAskedForPaymentCheckout(true)
                    setIsLoading(false);

                }


            } else if (paymentCheckout) {
                const answerForCheckout = message.trim()
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(answerForCheckout),
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
                    setAskedForPaymentCheckout(false)
                    await updateConversation({sender: 'bot', text: 'Redirecting to the payments page...'});
                    setInput('')
                    setIsLoading(false);

                    //response
                } else {
                    await updateConversation({sender: 'bot', text: "Okay. Cancelled the booking process."});
                    isBookingProcessStarted = false
                    setInput('')
                    setIsLoading(false);

                }
            } else if (!paymentCheckout && !fetchMuseumId && !handleEighthQuestion && !handleZerothQuestion &&
                !handleFirstQuestion && !handleSecondQuestion && !handleThirdQuestion
                && !handleForthQuestion && !handleFifthQuestion && !handleSixthQuestion && !handleSeventhQuestion) {
                await updateConversation({sender: 'bot', text: ''});
                setIsLoading(false);

            }
        }
    }

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
        updateConversation({sender: 'bot', text: text});
    }

    function handleMyBookings() {
        // todo
    }

    function handleCheckAvailability() {
        // todo
    }

    function handleStartBooking() {
        handleSendMessage("book my ticket").then(r => {
            console.log("started:" + isBookingProcessStarted)
        })
    }

    const handleLanguageChange = () => {
        handleOpenDialog()
    }

    return (
        <div className="main-container">
            <div className="flex-item-big">
                <div className="gradient-border">
                    <div className="gradient-border-up">
                        <div className={'ticket-title-div'}>
                            <img src="/assets/ChatBot/ncsm.png" width={100} height={100} alt="Logo 1"/>
                            <h3><p>SangraM AI</p>संग्राम ए.आई</h3>
                            <img src="/assets/ChatBot/logo-ministry.png" width={100} height={100} alt="Logo 2"/>
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
                                <div className={'shortcuts'}>
                                    <button onClick={handleTicketStatus} className="shortcut_btn">Check ticket status
                                    </button>
                                    <button onClick={handleMyBookings} className="shortcut_btn">My bookings</button>
                                    <button onClick={handleCheckAvailability} className="shortcut_btn">Check
                                        Availability
                                    </button>
                                    <button onClick={handleStartBooking} className="shortcut_btn">Book my ticket now
                                    </button>
                                </div>
                                <div className={'messaging'}>
                                    <div className="msgBtnBox">
                                        <Button onClick={
                                            handleLanguageChange
                                        }
                                                type="primary"
                                                shape="circle"
                                                icon={<LanguageButton style={{color: 'black'}}/>}
                                                style={{backgroundColor: '#ffffff', borderColor: '#007bff'}}
                                        />
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
                                            <Button onClick={() => {
                                                handleSendMessage(input)
                                            }}
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
                                    <AlertDialog open={isDialogOpen} onClose={handleCloseDialog}
                                                 onLanguageChange={onLanguageChange}/>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>


        </div>

    );
};

export default Chatbot;
