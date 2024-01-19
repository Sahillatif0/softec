const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    team1 : String,
    team2 : String,
    venue : String,
    matchTime : Date
})

const Events = new mongoose.model("events", eventSchema);

module.exports = Events;