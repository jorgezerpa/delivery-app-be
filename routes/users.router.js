const express = require('express');
const usersController = require('./../controllers/users.controller');
const router = express.Router();
const passport = require('passport');
const authorization = require('../utils/authorization');

  //create user
router.post('/', async (req, res, next) => {
  try {
    const user = req.body;
    const result = await usersController.createUser(user);
    res.json({
        message: 'user created',
        result,
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'error'
        })
  }
});

  //get own
  router.get('/my-user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  try {
    const id = req.user.sub;
    const result = await usersController.getUser(id);
    res.json({
        message: 'user found',
        result,
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'user not found'
        })
  }
});

  //get user
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorization.checkRoles('admin'),  
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await usersController.getUser(id);
    res.json({
        message: 'user found',
        result,
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'user not found'
        })
  }
});


    //list users
router.get('/',
passport.authenticate('jwt', { session: false }),
authorization.checkRoles('admin'),  
  async (req, res, next) => {
  try {
    const result = await usersController.listUsers();
    res.json({
        message: 'users list',
        result,
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'ups! something happen.'
        })
  }
});


  //delete own user
  router.delete('/my-user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  try {
    const id = req.user.sub; //user to delete
    const result = await usersController.deleteUser(id);
    res.json({
        message: 'user deleted',
        result: ''
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'can not delete user'
        })
  }
});

  //delete user
  router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorization.checkRoles('admin'),
  async (req, res, next) => {
  try {
    const { id } = req.params; //user to delete
    const result = await usersController.deleteUser(id);
    res.json({
        message: 'user deleted',
        result: ''
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'can not delete user'
        })
  }
});

  //update own user
  router.patch('/my-user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  try {
    const id = req.user.sub; //user to delete
    const data = req.body;
    const result = await usersController.updateUser(id, data);
    res.json({
        message: 'user updated',
        result: ''
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'can not update user'
        })
  }
});

  //update user
  router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  authorization.checkRoles('admin'),
  async (req, res, next) => {
  try {
    const { id } = req.params; //user to delete
    const data = req.body;
    const result = await usersController.updateUser(id, data);
    res.json({
        message: 'user updated',
        result: ''
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'can not update user'
        })
  }
});


module.exports = router;