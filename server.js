const express = require('express');
const mongoose = require('mongoose');
const events = require("./models/events");
const usersCollection = require("./models/users");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const path = require('path');
const auth = require('./auth');
const cookie = require("cookie-parser");
const { scrapeContentByClass } = require('./work');

const app = express();
const port = 3000;
app.use(cookie());

const uri = 'mongodb://sahillatif78:Sahil123@ac-jcsy4gu-shard-00-00.homgozd.mongodb.net:27017,ac-jcsy4gu-shard-00-01.homgozd.mongodb.net:27017,ac-jcsy4gu-shard-00-02.homgozd.mongodb.net:27017/?ssl=true&replicaSet=atlas-cz17q8-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(uri).then(() => {
    console.log("connection success")
}).catch((error) => {
console.log("no connection " + error);
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/home',auth,(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get("/logout", auth, async (req, res) => {
    const token = req.token;
    const currentUser = req.currentUser
    currentUser.tokens = currentUser.tokens.filter((currentElem) => {
        return currentElem.token !== token
    })
    await currentUser.save();
    res.clearCookie("jwtoken");
    res.redirect('/login');
});
app.post('/signup', async (req, res) => {
    const data = req.body;
    data.createdAt = Date.now();
    data.fvrt = [];
    data.bkmrks = [];
    console.log(data);
    try {
        const existedUSer = await usersCollection.find({email: data.email});
        console.log(existedUSer);
        if (existedUSer.length>0) {
            res.status(406).send("emailExist");
        } else {
            const newUser = new usersCollection(data);
            await newUser.save();
            token = await newUser.generateAuthToken();
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 1800000),
                httpOnly: true
            });
            res.status(200).send("success");
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/fav', auth, async (req, res) => {
    const data = req.body;
    console.log(data);
});
app.post('/bkm', auth, async (req, res) => {
    const data = req.body;
    console.log(data);
});
app.post('/login', async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
        const user = await usersCollection.findOne({email: data.email});
        console.log(user);
        if (user) {
            token = await user.generateAuthToken();
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 1800000),
                httpOnly: true
            });
            res.status(200).send("success");
        } else {
            res.status(406).send("invalid");
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/team/:teamName', async (req, res) => {
    const teamName = req.params.teamName;
    try {
        const matches = await events.find({
            $or: [
                { team1: { $regex: new RegExp(teamName, 'i') } },
                { team2: { $regex: new RegExp(teamName, 'i') } }
            ]
        })

        if (matches.length > 0) {
            res.json(matches);
        } else {
            console.log(`No matches found for ${teamName}`);
            res.json([]);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});