const {
    MUSEUM_TICKET_BOOK_QUERY,
    GENERAL_INQUIRY,
    GREETINGS,
    FAREWELL,
    OPENING_HOURS,
    PRICE_INQUIRY
} = require("../../src/components/ChatBot/query_constants");

const trainingData = [

    {text: "I want to book a museum ticket", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Can you help me with a ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Book a ticket for the museum", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "How do I book a museum ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},


    {text: "Give me the number of museums I can book tickets for?", intent: GENERAL_INQUIRY},
    {text: "Tell me about the museum", intent: GENERAL_INQUIRY},
    {text: "What are the top museums?", intent: GENERAL_INQUIRY},
    {text: "Are there any popular museums?", intent: GENERAL_INQUIRY},
    {text: "is there ny booking for ?", intent: GENERAL_INQUIRY},
    {text: "i want to know the status for the booking ?", intent: GENERAL_INQUIRY},


    {text: "Hello", intent: GREETINGS},
    {text: "Hi there!", intent: GREETINGS},
    {text: "Good morning", intent: GREETINGS},
    {text: "Hey!", intent: GREETINGS},


    {text: "Goodbye", intent: FAREWELL},
    {text: "See you later", intent: FAREWELL},
    {text: "Bye", intent: FAREWELL},
    {text: "Catch you later", intent: FAREWELL},


    {text: "What time does the museum open?", intent: OPENING_HOURS},
    {text: "When can I visit the museum?", intent: OPENING_HOURS},
    {text: "What are the opening hours?", intent: OPENING_HOURS},
    {text: "Is the museum open today?", intent: OPENING_HOURS},


    {text: "How much is a museum ticket?", intent: PRICE_INQUIRY},
    {text: "What is the cost of a ticket?", intent: PRICE_INQUIRY},
    {text: "Are there any discounts on tickets?", intent: PRICE_INQUIRY},
    {text: "Is there a fee to enter the museum?", intent: PRICE_INQUIRY},
];

module.exports = {intentTrainingData: trainingData};
