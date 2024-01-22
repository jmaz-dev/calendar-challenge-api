const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 description: String,
 startDate: Date,
 endDate: Date,
});

module.exports = mongoose.model("Event", eventSchema);
