const {MUSEUM_TICKET_BOOK_QUERY, GENERAL_INQUIRY, GREETINGS} = require("../../src/components/ChatBot/query_constants");
const trainingdata = [
    {text: "I want to book a museum ticket", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Can you help me with a ticket?", intent: MUSEUM_TICKET_BOOK_QUERY},
    {text: "Hello", intent: GREETINGS},
    {
        text: "Hi there!", intent: {text: "Hello", intent: GREETINGS},
    },
    {text: "Give me the number of museums i can book ticket for?", intent: GENERAL_INQUIRY},

    {text: "Tell me about the museum", intent: GENERAL_INQUIRY}
];
module.exports = {intentTrainingData: trainingdata}