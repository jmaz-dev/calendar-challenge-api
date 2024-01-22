const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 email: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 name: String,
 lastName: String,
 photo: String,
 isActive: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
