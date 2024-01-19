const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const { scrapeContentByClass } = require('./work');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/team/:teamName', async (req, res) => {
    const teamName = req.params.teamName;

    try {
        await client.connect();
        const database = client.db('NewDatabase');
        const collection = database.collection('saim');

        // Find all matches that have the entered team name
        const matches = await collection.find({
            $or: [
                { team1: { $regex: new RegExp(teamName, 'i') } },
                { team2: { $regex: new RegExp(teamName, 'i') } }
            ]
        }).toArray();

        if (matches.length > 0) {
            res.json(matches);
        } else {
            console.log(`No matches found for ${teamName}`);
            res.json([]);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
        console.log('Connection closed');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});