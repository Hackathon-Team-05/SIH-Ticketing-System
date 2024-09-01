const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 8080;
const QRCode = require("qrcode");
const sharp = require("sharp");
const Jimp = require("jimp");

const Mailjet = require("node-mailjet");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: "rzp_test_ZJlM6qFwFKlLhB",
    key_secret: "LW1X3XzRf2Lf5833yGOnpIRA",
});
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'sihdbconnection.cvu4owusgq3p.ap-south-1.rds.amazonaws.com',
    user: 'sih2024',
    password: 'sih12345.',
    database: 'Travel_Chatbot',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.get('/api/states', (req, res) => {
    const query = 'SELECT * FROM States';
    db.query(query, (err, rows) => {
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
    const query = 'SELECT * FROM Cities WHERE state_code = ?'

    db.query(query, [state_code], (err, rows) => {
        if (err) {
            return res.status(500).send({error: 'Database query failed'});
        }

        res.send(rows);
    });
});

app.get('/api/museums', (req, res) => {
    const {city} = req.query;
    const query = 'SELECT * FROM Museums WHERE city_name = ?';
    db.query(query, [city], (err, rows) => {
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
        SELECT price_adult, price_child, price_foreiner
        FROM Museums
        WHERE name = ?;`;

    db.query(query, [museum], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (row.length === 0) {
            return res.status(404).json({error: `Item not found in database {${museum}}`});
        }
        res.json(row[0]);
    });
});

app.get('/api/fetch_price/:museumId', (req, res) => {
    const museumId = req.params.museumId;

    if (!museumId) {
        return res.status(400).send({error: 'museum_id is required'});
    }

    const query = `SELECT * FROM Museums WHERE id = ?;`;

    db.query(query, [museumId], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (row.length === 0) {
            console.log("not found")
            return res.status(404).json({error: `Item not found in database {${museumId}}`});
        }
        res.json(row[0]);
    });
});
app.get('/api/fetch_price/event/:eventId', (req, res) => {
    const eventId = req.params.eventId;

    if (!eventId) {
        return res.status(400).send({error: 'eventId is required'});
    }

    const query = `SELECT event_name, child_price, adult_price, foreigner_price  FROM Events WHERE id = ?;`

    db.query(query, [eventId], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (row.length === 0) {
            console.log("not found")
            return res.status(404).json({error: `Item not found in database {${eventId}}`});
        }
        res.json(row[0]);
    });
});

const conversationFilePath = path.join(__dirname, '../conversation_history.json');
const genimage = async function generateTicket(ticketid) {
    const data = {
        Tid: ticketid,
    };

    try {
        //Generate QR Code
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(data));

        // Load the ticket template image
        const img2 = await sharp("rsc_tickettemp.png")
            .resize({height: 400})
            .toBuffer(); // Adjust height as needed

        // Get metadata of the ticket template image
        const img2Metadata = await sharp(img2).metadata();

        // Step 2:QR code image buffer

        const qrBuffer = await sharp(
            // eslint-disable-next-line no-undef
            Buffer.from(qrCodeDataUrl.split(",")[1], "base64")
        )
            .resize({width: 400, height: 400})
            .toBuffer();

        // Get metadata of the QR code image
        const qrMetadata = await sharp(qrBuffer).metadata();

        // Step 3:text image using Jimp
        db.query(
            "SELECT * FROM Ticket WHERE ticket_id= ?",
            [ticketid],
            async (err, ticketData) => {
                if (err) {
                    console.log("Error :-", err);
                }
                console.log(ticketData);

                const dft = {
                    Name: ticketData[0].name,
                    museumname: ticketData[0].museum_name,
                    eventsname: ticketData[0].events,
                    noa: ticketData[0].no_of_adults,
                    noc: ticketData[0].no_of_children,
                    nof: ticketData[0].no_of_foreigners,
                };

                console.log(dft);

                const text = `Name:${dft.Name} / Museum:${dft.museumname} / Event: ${dft.eventsname} / Adults:${dft.noa} / Children:${dft.noc} / Foreigner: ${dft.nof}`; //name,museumname,events
                const textImage = await new Jimp(1300, 60, 0xffffffff); // Create a white background
                const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK); // Load a font
                textImage.print(font, 10, 10, text); // Print text on the image

                //text image to buffer
                const textBuffer = await textImage.getBufferAsync(Jimp.MIME_PNG);

                // Get metadata of the text image
                const textMetadata = await sharp(textBuffer).metadata();

                const finalImage = await sharp({
                    create: {
                        width: img2Metadata.width + qrMetadata.width,
                        height: img2Metadata.height + textMetadata.height,
                        channels: 3,
                        background: {r: 255, g: 255, b: 255},
                    },
                }).composite([
                    {input: img2, top: 0, left: 0},
                    {input: qrBuffer, top: 0, left: img2Metadata.width},
                    {input: textBuffer, top: img2Metadata.height, left: 0},
                ]);

                await finalImage.toFile("ticket.png");
                console.log("file created");
            }
        );

        // Step 4: Combine images
    } catch (error) {
        console.error("Error generating ticket:", error.message);
    }
};
app.post("/api/payment-success", async (req, res) => {
    try {
        console.log("payment-success");

        const {
            name,
            mobile_no,
            noofchildren,
            noofforeigners,
            noofadults,
            museum_name,
            museum_id,
            status,
            date,
            events,
        } = req.body;


        let query =
            "INSERT INTO Ticket (name, phone_number, no_of_adults, no_of_children, no_of_foreigners,museum_id, museum_name, status, visit_date, events) VALUES (?, ?, ?, ?,?, ?, ?, ? ,?, ?)";

        db.query(
            query,
            [
                name,
                mobile_no,
                noofadults,
                noofchildren,
                noofforeigners,
                museum_id,
                museum_name,
                status,
                date,
                events
            ],
            (err, results) => {
                if (err) {
                    console.log("Error :-", err);
                }
                console.log(results);
            }
        );

        let query2 =
            "SELECT ticket_id FROM Ticket WHERE name = ? AND phone_number = ? AND no_of_adults = ? AND no_of_children = ? AND no_of_foreigners = ? AND museum_id = ? AND museum_name = ? AND status = ? AND visit_date = ? AND events = ?";
        db.query(
            query2,
            [
                name,
                mobile_no,
                noofadults,
                noofchildren,
                noofforeigners,
                museum_id,
                museum_name,
                status,
                date,
                events,
            ],
            (err, results) => {
                if (err) {
                    console.log("Error :-", err);
                }
                res.status(200).json({ticket_id: results[0].ticket_id});
            }
        );
    } catch (error) {
        console.error("Error inserting ticket:", error);
        res.status(500).json({error: "Error inserting ticket"});
    }
});
app.post(
    "/api/create-order/:amount/:name/:number/:noc/:nof/:noa/:museumId/:museum_name/:date/:events",
    async (req, res) => {
        console.log("create-order");
        try {
            const museumId = req.params.museumId
            const amt = req.params.amount;
            const nme = req.params.name;
            const mobno = req.params.number;
            const no_of_child = req.params.noc;
            const no_of_for = req.params.nof;
            const no_of_ad = req.params.noa;
            const museum_name = req.params.museum_name;
            const date = req.params.date;
            const events = req.params.events;

            const order = await razorpay.orders.create({
                amount: amt * 100,
                currency: "INR",
                receipt: "KCH" + Math.random().toString(36).substring(7),
            });

            res.json({
                orderId: order.id,
                amount: amt,
                name: nme,
                mobile_number: mobno,
                no_of_children: no_of_child,
                no_of_adults: no_of_ad,
                no_of_foreigners: no_of_for,
                museum_name: museum_name,
                museum_id: museumId,
                status: "allowed",
                date: date,
                events: events,
            });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({error: "Error creating order"});
        }
    }
);

app.get("/send-email/:email/:ticketid/:imageData", async (req, res) => {
    const email = req.params.email;
    const ticketid = req.params.ticketid;
    const base64String = req.params.imageData;

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
                    Name: "Ashish Kumar Samantaray",
                },
                To: [
                    {
                        Email: email,
                        Name: ticketid,
                    },
                ],
                Subject: "SANGRAMITRA Test Email",
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
            return res.status(200).json({message: "Successfully sent successfully."});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({message: "error."});
        });

})
app.get("/api/generate-image/:ticketid/", async (req, res) => {
    const tid = req.params.ticketid;


    console.log(tid);

    await genimage(tid).catch((err) => console.error(err));


    await new Promise((resolve) => setTimeout(resolve, 2000));

    const ticketFile = "./ticket.png";

    fs.readFile(ticketFile, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
        } else {
            const base64Data = data.toString("base64");
            res.json({imageData: base64Data, ticket_id: tid});
        }


        fs.unlink(ticketFile, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully");
            }
        });
    });
});
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


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
