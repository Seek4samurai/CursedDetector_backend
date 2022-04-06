const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
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
    cb(null, "test.wav");
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

// Server setup
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Parser
app.use(express.urlencoded({ extended: true }));

app.post("/response", upload.single("file"), (req, res) => {
  const file = `./uploads/test.wav`;
  const mimetype = "audio/wav";

  console.log("Done");
  const transcriptionArray = [];

  if (file.startsWith("http")) {
    source = {
      url: file,
    };
  } else {
    const audio = fs.readFileSync(file);
    source = {
      buffer: audio,
      mimetype: mimetype,
    };
  }

  deepgram.transcription
    .preRecorded(source, {
      punctuate: true,
    })
    .then((transcription) => {
      const transcriptionObject =
        transcription.results.channels[0].alternatives[0].words;
      transcriptionObject.map((wordData) => {
        transcriptionArray.push(wordData.word);
      });
      if (findCommonElement(transcriptionArray, badWordsArray)) {
        return res.status(200).json({ message: "Not safe!" });
      } else {
        return res.status(200).json({ message: "Safe!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Something went wrong!" });
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running or port ${PORT}`);
});
