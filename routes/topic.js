const express = require("express");
const authenticateToken = require("../libs/authenticateToken")
const router = express.Router()
let Topic = require("../models/topic.js").Topic;
const { body, validationResult } = require('express-validator');
let authenticate = require("./../libs/authenticateToken.js");

router.post("/api/topic", authenticateToken,
//validation
[
body("name").exists().isLength({ min: 1, max:128}).custom(value => {
  let nameCheck = value.replace(/[^a-zA-Z0-9]/g, "");
  if(value!=nameCheck){
      return Promise.reject('wrong symbol in name');
  }
  return true
}),
body("userID").exists(),
],
//
async (req, res)=> {
  try {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "wrong data in authorization"});
    }
    const {name, userID} =req.body 

    const topic= await Topic.findOne({ name: name}, { id: userID})
    if(topic){
      return res.status(401).send("name is already taken");
    }
    const newTopic = new Topic({
        name,
        userID
      });
    await newTopic.save(function(err, user, affected) {
      if (err) {
        return res.status(500).send("error user save");
      } else {
        return res.status(200).send(`topic ${name} was created`);
      }
    });
      } catch (error) {
        console.log(error)
        return res.status(500).send("some error");
      }
});
router.get("/api/topic", authenticateToken,async (req, res)=> {
    try {
        console.log("userID", req.userId)
        const topics= await Topic.find({"userID" : req.userId}) 
        console.log("topics", topics)
        return res.status(200).send(topics);
    }catch (error) {
        return res.status(500).send("some error");
      }
})
module.exports = router;
