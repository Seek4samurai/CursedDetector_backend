const express = require("express");
const dotenv = require("dotenv");
const badWords = require("./badwords.json");
const { Deepgram } = require("@deepgram/sdk");

dotenv.config();

const router = express.Router();
const badWordsArray = badWords.words;
const deepgramApiKey = process.env.KEY;

router.post("/response", async (req, res) => {
  res.send("Successfully responded!");

  // Initializes the Deepgram SDK
  const deepgram = new Deepgram(deepgramApiKey);

  const transcriptionArray = [];

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

  const audioStream = req.body.audioURL;
  const mimeType = req.body.mimeType;

  deepgram.transcription
    .preRecorded(
      { mimetype: mimeType },
      { url: audioStream },
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
