const express = require('express');
const authController = require('./../controllers/auth.controller');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/login',
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
  const user = req.user;
  try{
    const payload = {
      sub: user.id,
      role: user.role,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({
      user,
      token
    });
  }
  catch(e){
    console.log(e);
    res.json({
        message: 'unauthorized'
    })
  }
});


module.exports = router;