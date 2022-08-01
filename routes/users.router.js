const express = require('express');
const usersController = require('./../controllers/users.controller');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json({
        messge: 'user created'
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'error'
        })
  }
});

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
router.get('/:id', async (req, res, next) => {
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


module.exports = router;