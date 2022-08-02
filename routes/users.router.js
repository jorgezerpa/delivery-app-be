const express = require('express');
const usersController = require('./../controllers/users.controller');
const router = express.Router();
const passport = require('passport');

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

  //get user
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
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


  //delete user
  router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
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

  //update user
  router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
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