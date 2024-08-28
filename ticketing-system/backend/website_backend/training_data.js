const {
    MUSEUM_TICKET_BOOK_QUERY,
    GENERAL_INQUIRY,
    GREETINGS,
    FAREWELL,
    OPENING_HOURS,
    PRICE_INQUIRY
} = require("../../src/components/ChatBot/query_constants");

const trainingData = [
    // Museum Ticket Booking Queries
    {text: "I want to book a museum ticket", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Can you help me with a ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Book a ticket for the museum", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "How do I book a museum ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Could you assist me in booking a museum ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "I'd like to reserve a ticket for the museum", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "What's the process for booking a ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "How can I get a ticket for the museum?", intent: MUSEUM_TICKET_BOOK_QUERY},

    // General Inquiries
    {text: "Give me the number of museums I can book tickets for?", intent: GENERAL_INQUIRY},
    {text: "Tell me about the museum", intent: GENERAL_INQUIRY},
    {text: "What are the top museums?", intent: GENERAL_INQUIRY},
    {text: "Are there any popular museums?", intent: GENERAL_INQUIRY},
    {text: "Could you list some famous museums?", intent: GENERAL_INQUIRY},
    {text: "Which museums are well-known?", intent: GENERAL_INQUIRY},
    {text: "I'm interested in learning about museums", intent: GENERAL_INQUIRY},
    {text: "What are some good museums to visit?", intent: GENERAL_INQUIRY},

    // Greetings
    {text: "Hello", intent: GREETINGS},
    {text: "Hi there!", intent: GREETINGS},
    {text: "Good morning", intent: GREETINGS},
    {text: "Hey!", intent: GREETINGS},
    {text: "Greetings!", intent: GREETINGS},
    {text: "Hi", intent: GREETINGS},
    {text: "Hello there!", intent: GREETINGS},
    {text: "Good evening", intent: GREETINGS},

    // Farewells
    {text: "Goodbye", intent: FAREWELL},
    {text: "See you later", intent: FAREWELL},
    {text: "Bye", intent: FAREWELL},
    {text: "Catch you later", intent: FAREWELL},
    {text: "Take care", intent: FAREWELL},
    {text: "See you soon", intent: FAREWELL},
    {text: "Farewell", intent: FAREWELL},
    {text: "I have to go now", intent: FAREWELL},

    // Opening Hours
    {text: "What time does the museum open?", intent: OPENING_HOURS},
    {text: "When can I visit the museum?", intent: OPENING_HOURS},
    {text: "What are the opening hours?", intent: OPENING_HOURS},
    {text: "Is the museum open today?", intent: OPENING_HOURS},
    {text: "What time does the museum close?", intent: OPENING_HOURS},
    {text: "Can you tell me the museum hours?", intent: OPENING_HOURS},
    {text: "When does the museum shut?", intent: OPENING_HOURS},
    {text: "Are there any special visiting hours?", intent: OPENING_HOURS},

    // Price Inquiries
    {text: "How much is a museum ticket?", intent: PRICE_INQUIRY},
    {text: "What is the cost of a ticket?", intent: PRICE_INQUIRY},
    {text: "Are there any discounts on tickets?", intent: PRICE_INQUIRY},
    {text: "Is there a fee to enter the museum?", intent: PRICE_INQUIRY},
    {text: "What are the ticket prices?", intent: PRICE_INQUIRY},
    {text: "Do children get free entry?", intent: PRICE_INQUIRY},
    {text: "How much do I have to pay for a museum ticket?", intent: PRICE_INQUIRY},
    {text: "Are tickets expensive?", intent: PRICE_INQUIRY},
];


module.exports = {intentTrainingData: trainingData};
