const express = require("express");
const authenticateToken = require("../libs/authenticateToken")
const router = express.Router()
let Topic = require("../models/topic.js").Topic;
const { body, validationResult } = require('express-validator');
router.post("/api/topic", authenticateToken,
//validation
[
body("name").exists().isLength({ min: 1, max:128}).custom(value => {
  let nameCheck = value.replace(/[^a-zA-Z0-9 ]/, "");
  if(value!=nameCheck){
      return Promise.reject('wrong symbol in name');
  }
  return true
}),
],
//
async (req, res)=> {
  try {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "wrong data in topic creation"});
    }
    const {name} =req.body 

    const topic= await Topic.findOne({ name: name}, { id: req.userId})
    if(topic){
      return res.status(401).send("name is already taken");
    }
    const newTopic = new Topic({
        name,
        userID:req.userId
      });
    await newTopic.save(function(err, topic, affected) {
      if (err) {
        return res.status(500).send("error topic save");
      } else {
        return res.status(200).send(`topic ${name} was created`);
      }
    });
      } catch (error) {
        console.log(error)
        return res.status(500).send("some error");
      }
});
router.get("/api/topic", authenticateToken, async (req, res)=> {
    try {
        const topics= await Topic.find({"userID" : req.userId}) 
        const result = await topics.map(item=>({
            name:item.name,
            id:item.id,
            count:0
        }))
        return res.status(200).send(result);
    }catch (error) {
        return res.status(500).send("some error");
      }
})
module.exports = router;
