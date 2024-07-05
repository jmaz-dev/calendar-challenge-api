require("moment");
require("dotenv").config();

//packages
const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/Routes");
const cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());

//solve CORS
app.use(
  cors({
    origin: "*",
  })
);

//DB connection
require("./config/db.js");

//routes
app.use("/api", apiRoutes);
app.listen(port || 5000, () => {
  console.log(`app rodando na porta ${port}`);
});

// Test
router.get("/", (req, res) => {
  res.send("API Working!");
});


module.exports = app;
