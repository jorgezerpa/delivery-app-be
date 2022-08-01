const express = require('express');

const authRouter = require('./auth.router');
const usersRouter = require('./users.router');
const clustersRouter = require('./clusters.router');
const ordersRouter = require('./orders.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/auth', authRouter);
  router.use('/clusters', clustersRouter);
  router.use('/orders', ordersRouter);
}

module.exports = routerApi;