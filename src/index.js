const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const controllerDG = require("./controller");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", controllerDG);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running or port ${PORT}`);
});
