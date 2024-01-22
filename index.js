const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/Routes");

dotenv.config();

const app = express();
const { MONGO_DB_USERNAME, MONGO_DB_PASSWORD, SERVER_PORT } = process.env;

const mongoURI = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.ksyib9i.mongodb.net/`;
const PORT = SERVER_PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(mongoURI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB:"));
db.once("open", () => {
 console.log("Conectado ao MongoDB");
});

app.use("/api", apiRoutes);

app.listen(PORT, () => {
 console.log(`Servidor rodando na porta ${PORT}`);
});
