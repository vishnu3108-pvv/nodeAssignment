//  node js 

const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

// In-memory URL mappings
const urlMap = new Map();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const filePath = 'C:\\Users\\ARPANDEY\\Desktop\\work\\exam\\index.html';
    res.sendFile(filePath);
});

// API Endpoint for URL shortening
app.post('/shorten', (req, res) => {
    const longURL = req.body.longURL;
    if (!longURL) {
        return res.status(400).json({ error: 'Long URL is required' });
    }

    const shortCode = shortid.generate();
    const shortURL = `${shortCode}`;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);



    urlMap.set(shortCode, { longURL, expirationDate });

    res.json({ shortURL });
});



app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;
    const entry = urlMap.get(shortCode);

    if (!entry || new Date() > entry.expirationDate) {
        return res.status(404).json({ error: 'Short URL not found or has expired' });
    }

    res.redirect(entry.longURL);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

