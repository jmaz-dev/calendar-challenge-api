const mongoose = require("mongoose");
const dbDbUri = process.env.MONGODB_URI;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(`${dbDbUri}`);
    console.log("Conectou ao banco!");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;