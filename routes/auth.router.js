const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const authSchema = require('../schemas/auth.schema');
const validatorHandler = require('../middlewares/validator.handler');

router.post('/login',
  validatorHandler(authSchema.loginSchema, 'body'),
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
    next(boom.badRequest(e))
  }
});


module.exports = router;