const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/Routes");
const dotenv = require("dotenv");
const cors = require("cors");
const moment = require("moment");
const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(
 cors({
  origin: "*",
 })
);

const { MONGO_DB_USERNAME, MONGO_DB_PASSWORD, SERVER_PORT } = process.env;

const mongoURI = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.ksyib9i.mongodb.net/`;
const PORT = SERVER_PORT || 3000;

mongoose.connect(mongoURI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB:"));
db.once("open", () => {});

app.use("/api", apiRoutes);

app.listen(PORT, () => {});
