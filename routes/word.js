const express = require("express");
const authenticateToken = require("../libs/authenticateToken")
const router = express.Router()
let Word = require("../models/word.js").Word;
const { body, validationResult } = require('express-validator');
router.post("/api/word", authenticateToken,
//validation
[
body("word").exists().isLength({ min: 1, max:128}).custom(value => {
  let nameCheck = value.replace(/[^a-zA-Z0-9 ]/, "");
  if(value!=nameCheck){
      return Promise.reject('wrong symbol in word');
  }
  return true
}),
body("translate").exists().isLength({ min: 1, max:128}).custom(value => {
    let nameCheck = value.replace(/[^a-zA-Z0-9а-яА-Яії ]/, "");
    if(value!=nameCheck){
        return Promise.reject('wrong symbol in word');
    }
    return true
  }),
body("topicID").exists()
],
//
async (req, res)=> {
  try {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "wrong data in word creation"});
    }
    const {word, translate, topicID} =req.body 
    const newWord = new Word({
        word, 
        translate,
        topicID,
        learned:false
      });
    await newWord.save(function(err, word, affected) {
      if (err) {
        return res.status(500).send("error word save");
      } else {
        return res.status(200).send(`topic ${word} was created`);
      }
    });
      } catch (error) {
        console.log(error)
        return res.status(500).send("some error");
      }
});
router.get("/api/word", authenticateToken, async (req, res)=> {
    try {
        id=req.query.id
        console.log(id)
        if(!id){
            return res.status(404).send("error need id qerty param");
        }
        const words= await Word.find({"topicID" : id}) 
        const result = await words.map(item=>({
            word:item.word,
            translate: item.translate,
            id:item.id,
            learned:item.learned
        }))
        return res.status(200).send(result);
    }catch (error) {
        return res.status(500).send("some error");
      }
})
module.exports = router;
