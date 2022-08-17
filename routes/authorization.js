const express = require("express");
const router = express.Router()
const jwt= require("jsonwebtoken");
let User = require("../models/user.js").User;
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
router.post("/api/auth", 
//validation
[
body("login").exists().isLength({ min: 3, max:64}).custom(value => {
  let loginCheck = value.replace(/[^a-zA-Z0-9]/g, "");
  if(value!=loginCheck){
      return Promise.reject('wrong symbol in login');
  }
  return true
}),
body("password").exists().isLength({ min: 8 , max:64 }),
],
//
async (req, res)=> {
  try {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "wrong data in authorization"});
    }
    const {login, password} =req.body 
    const user= await User.findOne({login})
    if(!user){
      return res.status(400).send("user not found");
    }
    const isMutch = await bcrypt.compare(password, user.password) 
    if (!isMutch){
      return res.status(400).send("wrong password"); 
    }

    const token = jwt.sign(
      {userId:user.id},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    )
    return res.status(200).json({token,userId:user.id, login:user.login});
      } catch (error) {
        
        return res.status(500).send("some error");
      }
});

module.exports = router;
