const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require('dotenv').config();
app.use(cookie());

const usersCollection = require("./models/users");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        if (!token) {
            res.redirect('/login');
        }
        else {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            
            const currentUser = await usersCollection.findOne({
                email: verifyToken.email,
                "tokens.token": token
            })

            if (!currentUser) {
                res.redirect('/login');
            }
            else {
                req.token = token;
                req.currentUser = currentUser;
                next();
            }
        }
    } catch (err) {
        res.status(401).send(err);
    }
}
module.exports = auth;