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
    notValidPrompts,
    sorryNess,
    startComplaint,
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
import {handlePayment} from "./HandlePayment";
import Mailjet from "node-mailjet";

let bookingIndex = 0;
let backendPort = 8080
let chatbotBackend = 5000
const GENERAL_INQUIRY_ = 0
const TICKET_BOOK_QUERY_ = 1
const GREETINGS_ = 2
const COMPLAINT_ = 3
let isBookingProcessStarted = false
let isComplainProcessStarted = false
let totalEventPrice = 0

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
    const [complainDescription, setAskedForComplainDescription] = useState(false);
    const [finalArrayOfValidTickets, setArrayOfValidTickets] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [name, setName] = useState('Satwik Kar');
    const [museumId, setMuseumId] = useState(-1);
    const [museumName, setMuseumName] = useState('');
    const [eventNames, setEventNames] = useState([]);
    const [wantTicketInEmail, setWantTicketInEmail] = useState(false);
    const [checkWantEmail, setCheckWantEmail] = useState(false);
    const [imageData, setImageData] = useState('');
    const [ticketId, setTicketId] = useState('');

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const onLanguageChange = async (language) => {
        setLanguageCode(language)
        handleCloseDialog();
        console.log(language)
    }

    async function translateIfRequired(text) {
        if (languageCode === 'en') {
            return text
        }
        setIsLoading(true);
        try {
            const RAPIDAPI_KEY = '22560c3fa1mshbed057c1c31ce39p1bcdedjsn5069492c2377';
            const RAPIDAPI_HOST = 'microsoft-translator-text.p.rapidapi.com';
            const response = await axios({
                method: 'POST', url: `https://${RAPIDAPI_HOST}/translate`, params: {
                    'api-version': '3.0', from: 'en', to: languageCode,
                }, headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST,
                }, data: [{
                    text: text
                }]
            });

            const translation = response.data[0].translations[0].text;
            return translation;
        } catch (error) {
            console.error('Error translating text:', error);
            return text;
        } finally {
            setIsLoading(false);
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
        return true;
    }

    async function isQueryQuestion(input) {


        const response = await axios.post(`http://localhost:${chatbotBackend}/classify`, {text: input})
        const data = await response.data;
        console.log(data)
        if (data.intent === "GENERAL_INQUIRY") {
            return GENERAL_INQUIRY_
        } else if (data.intent === "GREETINGS") {
            return GREETINGS_
        } else if (data.intent === "MUSEUM_TICKET_BOOK_QUERY") {
            isBookingProcessStarted = true
            return TICKET_BOOK_QUERY_
        } else if (data.intent === "COMPLAINT") {
            return COMPLAINT_
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
            one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
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
            adults, children, foreigners
        };
    }

    function handleSendOtp(mobileNumber) {
        return true
    }

    function handleCheckOtp(otp) {
        return true
    }

    function extractEmail(message) {
        // const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        const emailPattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/

        const matches = message.match(emailPattern);

        return matches ? matches : [];
    }

    function extractNames(message) {
        const namePattern = /([A-Z][A-Z\s]+)(?:,\s?([A-Z][A-Z\s]+))?/

        const matches = message.match(namePattern);

        return matches ? matches : [];
    }

    function extractTicketIds(message) {
        //ODI2408300d1c5
        const ticketIdRegex = /[A-Z]{3}\d{6}[a-z0-9]+/;

        const ticketIds = message.match(ticketIdRegex);

        return ticketIds ? ticketIds : [];
    }

    function extractIdsFromString(message) {
        const namePattern = /\b\d+(?:,\d+)*\b/

        const matches = message.match(namePattern);

        return matches ? matches : [];
    }

    const updateConversation = async (newMessage) => {
        setIsLoading(true);
        try {
            const translatedText = await translateIfRequired(newMessage.text);
            setConversation(prev => [...prev, {...newMessage, text: translatedText}]);
        } catch (error) {
            console.error('Error in updateConversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSendMessage(input)
        }
    }

    const downloadImage = async (ticketId) => {
        try {
            const response = await fetch(
                `http://localhost:${backendPort}/api/generate-image/${ticketId}`
            );
            const data = await response.json();
            console.log(data);
            const dataURI = `data:image/png;base64,${data.imageData}`;
            setImageData(data.imageData)

            const link = document.createElement("a");
            link.href = dataURI;
            link.download = `ticket-${data.ticket_id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the image:", error);
        }
    };
    const sendTicketMail = (base64String, email = null, ticketid) => {
        if (email === null || email === "null") {
            return;
        }

        const pubkey = "7773977fa4c821182c2e6c0b39ccf93b";
        const seckey = "e4658c43c7eeca489681e1be54e5001a";

        const mailjet = Mailjet.apiConnect(pubkey, seckey);

        const request = mailjet.post("send", {version: "v3.1"}).request({
            Messages: [
                {
                    From: {
                        Email: "ashish.kumar.samantaray2003@gmail.com",
                        Name: "SangrahaMitra",
                    },
                    To: [
                        {
                            Email: email,
                            Name: ticketid,
                        },
                    ],
                    Subject: "SangrahaMitra ticket booking",
                    TextPart:
                        "Dear users, welcome to the advanced AI based ticketing system",
                    HTMLPart:
                        "<h3>Welcome to SangrahaMitra</h3><br/>May the museum visit be flawless",
                    Attachments: [
                        {
                            ContentType: "image/png",
                            Filename: `ticket${ticketid}.png`,
                            Base64Content: base64String,
                        },
                    ],
                },
            ],
        });

        request
            .then((result) => {
                console.log(result.body);
            })
            .catch((err) => {
                console.log(err);
            });
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
                    await updateConversation({
                        sender: 'bot',
                        text: "Are you an individual or an organisation? Tickets price may vary accordingly."
                    });

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

                    const conversationHistory = ["User:Keep in mind that you are a e-ticketing chat bot for National Museum tickets of India. " + "Your name is SangraM AI. You help people to book their national museum tickets.", "Assistant: Sure, I'd be happy to help!",];

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
                        sender: 'bot', text: 'Sorry, I encountered an error. Please refresh the page.'
                    });
                }
            } else if (query === COMPLAINT_) {

                try {
                    console.log("This is a complaints intent")
                    let sryStatements = sorryNess
                    let startComplaintStatements = startComplaint

                    const random = Math.floor(Math.random() * sryStatements.length)
                    let sryStatement = sryStatements[random];
                    let startComplaintStatement = startComplaintStatements[random];


                    updateConversation({sender: 'bot', text: sryStatement});
                    updateConversation({sender: 'bot', text: startComplaintStatement});
                    updateConversation({sender: 'bot', text: "Reply your ticket id written on your ticket."});
                    isComplainProcessStarted = true

                    setIsLoading(false)
                } catch (error) {
                    console.error('Error:', error);
                    setIsLoading(false)
                }

            } else {
                await updateConversation({
                    sender: 'bot',
                    text: "I'm sorry, I didn't quite get that. Could you please rephrase your question or provide more details?"
                });
                setIsLoading(false)
            }
        } else if (isComplainProcessStarted) {
            if (!complainDescription) {
                ///////////////////////////////////
                let prompts = notValidPrompts


                const ticketIdMessage = message.trim()
                const ticketIds = extractTicketIds(ticketIdMessage)
                if (ticketIds.length === 1) {
                    if (checkValidTicketStructure(ticketIds[0])) {
                        updateConversation({sender: 'bot', text: `Your given ticket id is ${ticketIds[0]}`})
                        //

                    } else {
                        const random = Math.floor(Math.random() * prompts.length)
                        let noValidPrompt = prompts[random];
                        updateConversation({sender: 'bot', text: noValidPrompt})

                    }

                } else if (ticketIds.length > 1) {
                    updateConversation({sender: 'bot', text: `You have given more than 1 ticket ids.`})
                    let arrayOfValidTickets = []
                    let arrayOfNonValidTickets = []
                    for (let i = 0; i < ticketIds.length; i++) {
                        if (checkValidTicketStructure(ticketIds[i])) {
                            arrayOfValidTickets.push(ticketIds[i])

                        } else {
                            arrayOfNonValidTickets.push(ticketIds[i])
                        }

                    }

                    if (arrayOfValidTickets.length === ticketIds.length) {
                        //alll are valids

                        updateConversation({sender: 'bot', text: 'Reply the description of your complain.'})
                        setArrayOfValidTickets(arrayOfValidTickets)
                        setAskedForComplainDescription(true)

                    } else {
                        //any non valid ticket is there
                        updateConversation({
                            sender: 'bot',
                            text: 'You have given a wrong structured ticket id. Please reply with the valid ticket ids.'
                        })
                        updateConversation({sender: 'bot', text: 'Here are the invalid ticket ids.'})
                        for (let i = 0; i < ticketIds.length; i++) {

                            updateConversation({sender: 'bot', text: arrayOfNonValidTickets[i]})

                        }

                    }


                } else {
                    updateConversation({sender: 'bot', text: 'Can you again reply the ticket id?'})
                }
            } else if (complainDescription) {
                const description = message.trim()
                //backend call to push complain
                let complainUrl = ""
                for (let i = 0; i < finalArrayOfValidTickets.length; i++) {

                    let request = await axios.post(complainUrl, {
                        ticket_id: finalArrayOfValidTickets[i],
                        description: description
                    })
                    let response = request.data

                }


            }


        } else {
            setIsLoading(false);
            await updateConversation({sender: 'user', text: message});

            if (handleZerothQuestion) {


                if (message.trim().toLowerCase().split(" ").includes("individual")) {

                    setIsOrganisation(false)
                    setInput('')
                    setHandleZerothQuestion(false)
                    setHandleFirstQuestion(true)
                    await updateConversation({sender: 'bot', text: "Provide your mobile number for authentication."});
                    setIsLoading(false);

                } else if (message.trim().toLowerCase().split(" ").includes("organisation")) {

                    setIsOrganisation(true)
                    await updateConversation({
                        sender: 'bot',
                        text: `Congratulations, you are eligible for a discount of ${organisationDiscount}%.`
                    });
                    await updateConversation({sender: 'bot', text: "Provide your mobile number for authentication."});
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

                        setInput('')
                        setHandleFirstQuestion(false)
                        setHandleSecondQuestion(true)
                        await updateConversation({
                            sender: 'bot',
                            text: "OTP sent to the provided mobile number. Submit the Otp to continue."
                        });
                        setIsLoading(false);

                    }
                } else {
                    await updateConversation({
                        sender: 'bot', text: 'This is not a valid phone number. Please message again.'
                    });
                    setIsLoading(false);

                }
            } else if (handleSecondQuestion) {
                if (handleCheckOtp(message)) {

                    setInput('')
                    setHandleSecondQuestion(false)
                    setHandleThirdQuestion(true)
                    await updateConversation({sender: 'bot', text: 'OTP verified!'});
                    await updateConversation({
                        sender: 'bot',
                        text: "How many of these are for adults, children, and foreigners? \nExample -> X child, X adult, X foreigners"
                    });
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
                const response = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", {
                    headers: {
                        Authorization: "Bearer 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",
                        "Content-Type": "application/json",
                    }, method: "POST", body: JSON.stringify(message),
                });
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

                    setHandleForthQuestion(false)
                    setHandleSeventhQuestion(true)
                    await updateConversation({
                        sender: 'bot',
                        text: "Please provide the first name with last name for the ticket. Example -> satwik kar,other names,etc"
                    });
                    setInput('')
                    setIsLoading(false);

                } else {
                    setInput('')
                    setHandleForthQuestion(true)
                    setHandleSeventhQuestion(false)
                    await updateConversation({sender: 'bot', text: "Okay.Try again!"});
                    setIsLoading(false);

                }
            } else if (handleSeventhQuestion) {
                let name = message.trim()
                let f_name = extractNames(name)
                setName("Satwik Kar")
                setInput('')
                setHandleSeventhQuestion(false)
                setHandleEighthQuestion(true)
                await updateConversation({sender: 'bot', text: "For which city you want to book the museum?"});
                setIsLoading(false);


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
                console.log("museum id:" + museumId)
                setMuseumId(museumId)
                const url = `https://guyk0ymti9.execute-api.ap-south-1.amazonaws.com/server-dev/api/fetch_price/${museumId}`
                const result = await axios.get(url)

                let name = result.data.name
                setMuseumName(name)


                const statement = `Is there any event going on for the museum id ${museumId} ?`
                const requestQueryEvents = await axios.post(`http://localhost:${chatbotBackend}/chat`, {"message": statement});
                const answer = await requestQueryEvents.data.response;
                ////////////////////////////////////
                const requestSentiment = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", {
                    headers: {
                        Authorization: "Bearer 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",
                        "Content-Type": "application/json",
                    }, method: "POST", body: JSON.stringify(answer),
                });
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
                setTotalBill(totalMoney)

                await updateConversation({
                    sender: 'bot', text: `
                Here are the details for the pricing of the tickets for ${result.data.name}:
                    (1). Adult: ${adultPrice != null ? adultPrice : "Not specified."}
                    (2). Child: ${childPrice != null ? childPrice : "Not specified."}
                    (3). Foreigner: ${foreignerPrice != null ? foreignerPrice : "Not specified."}
                `
                });
                setTotalBill(totalMoney)
                await updateConversation({
                    sender: 'bot', text: `
                Your total bill amount is ${totalMoney}.
                Number of adult tickets is ${noOfAdults} which adds up to Rs ${totalAdultPrice}.
                Number of child tickets is ${noOfChildren} which adds up to Rs ${totalChildPrice}.
                Number of foreigner tickets is ${noOfForeigners} which adds up to Rs ${totalForeignerPrice}.
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
                            sender: 'bot', text: 'Reply the event id/ids to book. Reply skip to proceed to payments.'
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
                            sender: 'bot', text: 'Proceed to payments?'
                        })
                        setIsLoading(false);

                    }


                }
            } else if (checkEventAdded) {
                if (message.trim() === "skip") {
                    await updateConversation({
                        sender: 'bot', text: "Do you really want to skip the event booking for this museum?"
                    });
                    setFetchMuseumId(false)
                    setTicketEventAdded(false)
                    setAskedForPaymentCheckout(true)
                    setIsLoading(false);
                } else {
                    const eventIds = extractIdsFromString(message.trim())


                    // Fetch prices for each event and calculate total
                    for (let i = 0; i < eventIds.length; i++) {
                        try {
                            // {
                            //     "event_name": "Art Exibition",
                            //
                            //     "adult_price": 20
                            //
                            // }
                            await axios.get(`http://localhost:${backendPort}/api/fetch_price/event/${eventIds[i]}`).then((response) => {

                                return response.data

                            }).then(data => {
                                // {
                                //     "event_name": "Art Exibition",
                                //
                                //     "adult_price": 20
                                //
                                // }
                                console.log(data)
                                setEventNames(prevState => [...prevState, data.event_name])


                                let priceEventTotal = Number(data.adult_price) * (noOfAdults + noOfForeigners + noOfChildren)


                                totalEventPrice += priceEventTotal


                            })


                        } catch (error) {
                            console.error(`Error fetching price for event ${eventIds[i]}:`, error);
                            await updateConversation({
                                sender: 'bot',
                                text: `There was an error fetching the price for event ${eventIds[i]}. Please try again.`
                            });
                            setIsLoading(false);
                            return;
                        }
                    }

                    let totalBillEvnAdded = totalBill + totalEventPrice
                    console.log("totalEventprice" + totalEventPrice)
                    setTotalBill(totalBillEvnAdded)


                    await updateConversation({
                        sender: 'bot', text: "Proceed to payments?"
                    });

                    setFetchMuseumId(false)
                    setTicketEventAdded(false)
                    setAskedForPaymentCheckout(true)
                    setIsLoading(false);
                }
            } else if (paymentCheckout) {
                console.log(totalBill)
                const answerForCheckout = message.trim()
                const response = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", {
                    headers: {
                        Authorization: "Bearer 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",
                        "Content-Type": "application/json",
                    }, method: "POST", body: JSON.stringify(answerForCheckout),
                });
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
                    let eventAppendString = ""

                    for (let i = 0; i < eventNames.length; i++) {
                        console.log(eventNames[i])
                        eventAppendString += `${eventNames[i]} `
                    }
                    const date = new Date();
                    const year = date.getFullYear().toString().slice(-2);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');

                    let dateString = `${year}-${month}-${day}`
                    console.log("eventAppend:" + eventAppendString)
                    let url = ""
                    if (eventAppendString.length !== 0) {
                        url = `https://o05edcws0c.execute-api.ap-south-1.amazonaws.com/payment-gateway-dev/api/create-order/${totalBill}/${name}/${phoneNumber}/${noOfChildren}/${noOfForeigners}/${noOfAdults}/${museumName}/${dateString}/${eventAppendString}`

                    } else {
                        url = `https://o05edcws0c.execute-api.ap-south-1.amazonaws.com/payment-gateway-dev/api/create-order/${totalBill}/${name}/${phoneNumber}/${noOfChildren}/${noOfForeigners}/${noOfAdults}/${museumName}/${dateString}/null`

                    }


                    await axios.post(url).then((response) => {


                        return response.data

                    }).then(async data => {


                        await handlePayment(url).then(ticketID => {
                            console.log("Updated response");
                            console.log(ticketID);
                            let ticketIDD = ticketID.ticket_id
                            setTicketId(ticketIDD)
                            updateConversation({
                                sender: 'bot',
                                text: 'Ticket ID generated successfully.Here is your ticket ID'
                            })
                            updateConversation({sender: 'bot', text: ticketIDD})

                            downloadImage(ticketIDD)
                            updateConversation({
                                sender: 'bot',
                                text: "Ticket is successfully downloaded to your device."
                            })
                            updateConversation({
                                sender: 'bot',
                                text: "Do you want to send the ticket in your email?"
                            })
                            setCheckWantEmail(true)


                        }).catch(error => {
                            console.error("An error occurred:", error);
                        });

                    }).finally(r => {
                        setIsLoading(false);
                    })


                    //response
                } else {
                    await updateConversation({sender: 'bot', text: "Okay. Cancelled the booking process."});
                    isBookingProcessStarted = false
                    setInput('')
                    setIsLoading(false);

                }
            } else if (checkWantEmail) {
                let answer = message.trim()
                console.log("checkWantEmail:" + answer)
                ///////////////////////////
                const response = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", {
                    headers: {
                        Authorization: "Bearer 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",
                        "Content-Type": "application/json",
                    }, method: "POST", body: JSON.stringify(answer),
                });
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
                    await updateConversation({
                        sender: 'bot',
                        text: "Reply you email to send the ticket..."
                    })
                    setWantTicketInEmail(true)

                } else {
                    await updateConversation({
                        sender: 'bot',
                        text: "Booking successfully done. Thank you for your cooperation. Enjoy your trip!!"
                    })
                    setWantTicketInEmail(false)
                    isBookingProcessStarted = false

                }

            } else if (wantTicketInEmail) {
                function extractAndValidateEmail(sentence) {
                    // Regular expression for validating an email address
                    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})/;

                    // Extract email address from the sentence
                    const match = sentence.match(emailRegex);

                    if (match) {
                        // Extracted email
                        const email = match[0];

                        // Validate the email address (you can enhance this regex as needed)
                        const isValidEmail = emailRegex.test(email);

                        return isValidEmail ? email : null;
                    }

                    return null;
                }


                let email = extractAndValidateEmail(message.trim())

                if (email !== null) {

                    sendTicketMail(imageData, email, ticketId)
                    await updateConversation({
                        sender: 'bot',
                        text: "Ticket successfully sent to your email address. Thank you for your co-operation."
                    })
                    await updateConversation({
                        sender: 'bot',
                        text: "Have a great day."
                    })
                    setWantTicketInEmail(false)
                    isBookingProcessStarted = false


                } else {
                    await updateConversation({sender: 'bot', text: "This is not a valid email. Please try again."});
                }


            } else if (!wantTicketInEmail && !checkEventAdded && !paymentCheckout && !fetchMuseumId && !handleEighthQuestion && !handleZerothQuestion && !handleFirstQuestion && !handleSecondQuestion && !handleThirdQuestion && !handleForthQuestion && !handleFifthQuestion && !handleSixthQuestion && !handleSeventhQuestion) {


            }
        }
    }

    function handleMicrophoneClick() {
        setIsOpen(true);
        startSpeechRecognition((transcript) => {
            setInput(transcript);
            setIsOpen(false);
        }, (error) => {
            console.error('Speech recognition error:', error);
            setIsOpen(false);
        });
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

    return (<div className="main-container">
            <div className="flex-item-big">
                <div className="gradient-border">
                    <div className="gradient-border-up">
                        <div className={'ticket-title-div'}>
                            <img src="/assets/ChatBot/ncsm.png" width={100} height={100} alt="Logo 1"/>
                            <h3><p><img src={'/assets/ChatBot/sangram-ai.png'}
                                        style={{width: 170, height: 55, marginTop: 40}}/></p><p style={{
                                marginBottom: 30,
                                color: '#4c2500',
                                backgroundColor: '#fff',
                                borderRadius: 15,
                                padding: 5
                            }}>संग्राम ए.आई</p></h3>
                            <img src="/assets/ChatBot/logo-ministry.png" width={100} height={100} alt="Logo 2"/>
                        </div>

                        <div className="scrollable">
                            <div className="message-container" ref={messageContainerRef}>
                                {conversation.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender} message-anim`}>
                                        {msg.text}
                                        {msg.sender === 'bot' && (<Button onClick={() => {
                                            speakMessage(msg.text)
                                        }}
                                                                          type="primary"
                                                                          shape="circle"
                                                                          icon={<SpeakerButton
                                                                              style={{
                                                                                  cursor: 'pointer',
                                                                                  marginLeft: '8px'
                                                                              }}/>}
                                                                          style={{
                                                                              backgroundColor: '#ffffff',
                                                                              alignSelf: 'flex-end'
                                                                          }}
                                        />)}
                                    </div>))}
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
                                        <Button onClick={handleLanguageChange}
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
                                            onKeyDown={handleKeyPress}
                                            min={0}
                                            onChange={handleInputChange}
                                        />
                                        {!isLoading && (<Button onClick={() => {
                                            handleSendMessage(input)
                                        }}
                                                                type="primary"
                                                                shape="circle"
                                                                icon={<SendButton style={{color: 'black'}}/>}
                                                                style={{
                                                                    backgroundColor: '#ffffff',
                                                                    borderColor: '#007bff'
                                                                }}
                                        />)}
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
