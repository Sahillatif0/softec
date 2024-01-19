const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const { scrapeContentByClass } = require('./work');

const app = express();
const port = 3000;

const uri = 'mongodb://sahillatif78:Sahil123@ac-jcsy4gu-shard-00-00.homgozd.mongodb.net:27017,ac-jcsy4gu-shard-00-01.homgozd.mongodb.net:27017,ac-jcsy4gu-shard-00-02.homgozd.mongodb.net:27017/?ssl=true&replicaSet=atlas-cz17q8-shard-0&authSource=admin&retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/team/:teamName', async (req, res) => {
    const teamName = req.params.teamName;

    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('events');

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