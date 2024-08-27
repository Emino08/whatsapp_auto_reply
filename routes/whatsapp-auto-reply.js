const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require("express");
const qrcode = require('qrcode');
var router = express.Router();

// Create a new client
const client = new Client({
    authStrategy: new LocalAuth()
});

let qrCodeUrl = null;
let isClientReady = false;

// Function to handle incoming messages
function handleIncomingMessage(message) {
    console.log('Received message:', message.body);
    const reply = `Dear Story Teller,

This line is an audio line. In the event you have sent a text message please respond with a 3 minute summary story. 

If you have sent your 3 minute summary story. We will listen to it and inform you whether or not we have selected it for further development. 

Please reply with your full name NOW for us to continue the process. 

Thank you,

Afrikan Echoes Publishing LTD. (AEP)

Telling the Afrikan story...`;

    message.reply(reply);
}


// Generate QR code
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrCodeUrl = url;
    });
    console.log('QR code generated. Visit /qr to view it.');
});

// When the client is ready
client.on('ready', () => {
    console.log('Client is ready!');
    isClientReady = true;
});

// Listen for incoming messages
client.on('message', handleIncomingMessage);

// Initialize the client
client.initialize();

// Route to check the status of the WhatsApp client
router.get('/status', (req, res) => {
    res.json({ status: isClientReady ? 'ready' : 'not ready' });
});

// Route to serve the QR code
router.get('/qr', (req, res) => {
    if (qrCodeUrl) {
        res.send(`<img src="${qrCodeUrl}" alt="Scan this QR code with your WhatsApp">`);
    } else {
        res.send('QR code not generated yet. Please refresh the page.');
    }
});

// Route to send a message
router.post('/send-message', async (req, res) => {
    if (!isClientReady) {
        return res.status(503).json({ error: 'WhatsApp client is not ready' });
    }

    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required' });
    }

    console.log("number: ", number, "message: ", message)

    try {
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        const sentMessage = await client.sendMessage(chatId, message);
        res.json({ status: 'success', messageId: sentMessage.id.id });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
