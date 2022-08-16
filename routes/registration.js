const express = require("express");
const router = express.Router();
var User = require("../models/user.js").User;
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const jwt= require("jsonwebtoken");
router.post("/api/registration", 
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
      return res.status(400).json({ errors: errors.array(), message: "wrong data in registration"});
    }
    const {login, password} =req.body 
    let hash = await bcrypt.hash(password, 11);
        // Store hash in your password DB.
        
        var user = new User({
          login: login,
          password: hash
        });
        const candidate= await User.findOne({login})
        if(candidate){
          return res.status(401).send("name is already taken");
        }
        await user.save(function(err, user, affected) {
          if (err) {
            return res.status(500).send("error user save");
          } else {
            const token = jwt.sign(
              {userId:user.id},
              process.env.JWT_SECRET,
              {expiresIn: '1h'}
            )
            return res.status(200).json({token,userId:user.id, login:user.login});
          }
        });
      } catch (error) {
        return res.status(500).send("some error");
      }
});

module.exports = router;
