const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    password : String,
    fvrt : Array,
    bkmrks : Array,
    createdAt: Date,
    tokens : [
        {
        token : String
    }
]
})

userSchema.methods.generateAuthToken = async function () {
    try{
        let token = jwt.sign({email: this.email}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }catch(error){
        console.log("In function", error);
    }
}

const Users = new mongoose.model("Users", userSchema);

module.exports = Users;