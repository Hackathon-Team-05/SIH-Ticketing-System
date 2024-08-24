const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const {join} = require("node:path");
const path = require("path");
const natural = require('natural');
const {intentTrainingData} = require("./training_data");

const app = express();
app.use(cors());
app.use(express.json());
const sqlDbPath = "../heritage_culture_data/heritage_culture.db";

const db = new sqlite3.Database(sqlDbPath);


app.get('/api/states', (req, res) => {
    const query = 'SELECT * FROM states';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});


app.get('/api/cities', (req, res) => {
    const {state_code} = req.query;


    if (!state_code) {
        return res.status(400).send({error: 'state_code is required'});
    }


    db.all('SELECT * FROM cities WHERE state_code = ?', [state_code], (err, rows) => {
        if (err) {
            return res.status(500).send({error: 'Database query failed'});
        }

        res.send(rows);
    });
});


app.get('/api/museums', (req, res) => {
    const {city} = req.query;
    const query = 'SELECT * FROM museums WHERE city_name = ?';
    db.all(query, [city], (err, rows) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});


app.get('/api/prices', (req, res) => {
    const {museum} = req.query;

    if (!museum) {
        return res.status(400).send({error: 'museum_name is required'});
    }

    const query = `
        SELECT adult_price, child_price, foreigner_price
        FROM museums
        WHERE name = ?;`;

    db.get(query, [museum], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (!row) {
            return res.status(404).json({error: `Item not found IN database {${museum}}`});
        }
        res.json(row);
    });
});
const conversationFilePath = path.join(__dirname, '../conversation_history.json'); // Adjusted path

app.get('/api/conversation', (req, res) => {
    fs.readFile(conversationFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Failed to read conversation history.'});
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            res.status(500).json({error: 'Failed to parse conversation history.'});
        }
    });
});

app.post('/api/conversation', (req, res) => {
    const newConversation = req.body;

    if (!newConversation) {
        return res.status(400).json({error: 'No conversation data provided.'});
    }


    fs.readFile(conversationFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') { // ENOENT means the file does not exist
            return res.status(500).json({error: 'Failed to read conversation history.'});
        }

        let existingConversation = [];
        if (data) {
            try {
                existingConversation = JSON.parse(data);
            } catch (e) {
                return res.status(500).json({error: 'Failed to parse existing conversation data.'});
            }
        }


        const updatedConversation = [...existingConversation, ...newConversation];


        fs.writeFile(conversationFilePath, JSON.stringify(updatedConversation, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({error: 'Failed to save conversation history.'});
            }
            res.status(200).json({message: 'Conversation history saved successfully.'});
        });
    });
});
const classifier = new natural.BayesClassifier();
intentTrainingData.forEach(item => classifier.addDocument(item.text, item.intent));
classifier.train();
app.post('/classify', (req, res) => {
    const {message} = req.body;
    console.log(message)
    const predictedIntent = classifier.classify(message);
    res.json({intent: predictedIntent});
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
