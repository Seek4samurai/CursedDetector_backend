const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const badWords = require("./src/badwords.json");
const { Deepgram } = require("@deepgram/sdk");

// Variables & keys
dotenv.config();
const app = express();
const deepgramApiKey = process.env.KEY;
const badWordsArray = badWords.words;

// Function definition with passing two arrays
function findCommonElement(array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        return true;
      }
    }
  }
  return false;
}

// Function for storing files
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);
const file = "";
const mimetype = "audio/wav";

// Server setup
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Parser
app.use(express.urlencoded({ extended: true }));

app.post("/index.html", upload.single("file"), (req, res) => {
  console.log("Done");
  res.send("Hello");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running or port ${PORT}`);
});
