const express = require("express");
const authenticateToken = require("../libs/authenticateToken")
const router = express.Router()
const { body } = require('express-validator');
const WordController = require("./../controllers/wordController.js")
router.post("/api/word", authenticateToken,
  [
    body("word").exists().isLength({ min: 1, max: 128 }).custom(value => {
      let nameCheck = value.replace(/[^a-zA-Z0-9 ]/, "");
      if (value != nameCheck) {
        return Promise.reject('wrong symbol in word');
      }
      return true
    }),
    body("translate").exists().isLength({ min: 1, max: 128 }).custom(value => {
      let nameCheck = value.replace(/[^a-zA-Z0-9а-яА-Яії ]/, "");
      if (value != nameCheck) {
        return Promise.reject('wrong symbol in word');
      }
      return true
    }),
    body("topicID").exists()
  ],
  WordController.create)

router.get("/api/word", authenticateToken, WordController.read)

router.put("/api/word", authenticateToken,
  [
    body("word").exists().isLength({ min: 1, max: 128 }).custom(value => {
      let nameCheck = value.replace(/[^a-zA-Z0-9 ]/, "");
      if (value != nameCheck) {
        return Promise.reject('wrong symbol in word');
      }
      return true
    }),
    body("translate").exists().isLength({ min: 1, max: 128 }).custom(value => {
      let nameCheck = value.replace(/[^a-zA-Z0-9а-яА-Яії ]/, "");
      if (value != nameCheck) {
        return Promise.reject('wrong symbol in word');
      }
      return true
    }),
    body("wordID").exists(),
    body("learned").exists()
  ],
  WordController.update)

router.delete("/api/word", authenticateToken, [
  body("wordsID").isArray(),
],
  WordController.delete)

module.exports = router;
