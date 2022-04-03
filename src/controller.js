const express = require("express");
const dotenv = require("dotenv");
const badWords = require("./badwords.json");
const { Deepgram } = require("@deepgram/sdk");

dotenv.config();

const router = express.Router();
const badWordsArray = badWords.words;
const deepgramApiKey = process.env.KEY;

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

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

router.post("/response", async (req, res) => {
  const transcriptionArray = [];

  // Getting request
  const audioStream = req.body.audioURL;
  const mimeType = req.body.mimeType;

  const bufferData = Buffer.from(audioStream, "binary"); // Buffer data
  const bufferString = bufferData.toString("hex").match(/../g).join(" ");

  console.log(bufferData);

  deepgram.transcription
    .preRecorded(
      { buffer: bufferData, mimetype: mimeType },
      { punctuate: true, language: "en-GB" }
    )
    .then((transcription) => {
      const transcriptionObject =
        transcription.results.channels[0].alternatives[0].words;
      transcriptionObject.map((wordData) => {
        transcriptionArray.push(wordData.word);
      });
      res.send(transcription);
      if (findCommonElement(transcriptionArray, badWordsArray)) {
        console.log("Not safe!");
      } else {
        console.log("Safe!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
