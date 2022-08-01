const express = require('express');
const ordersController = require('../controllers/orders.controller');
const clustersController = require('./../controllers/clusters.controller');
const router = express.Router();

    //reset clusters
router.get('/reset', async (req, res, next) => {
  try {
    const result = await clustersController.resetClusters();
    res.json({
        message: 'clusters reseted',
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'error'
        })
    }
});

    //list clusters
router.get('/', async(req, res, next)=>{
    try {
        const result = await clustersController.listClusters();
        res.json({
            message: 'cluster found',
            result: result,
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            message: 'cluster not found'
        })
    }
})

    //get cluster
router.get('/:id', async(req, res, next)=>{
    const { id } = req.params;
    try {
        const result = await clustersController.getCluster(id);
        res.json({
            message: 'cluster found',
            result: result,
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            message: 'cluster not found'
        })
    }
})

    //reserve cluster
router.patch('/reserve/:cluster_id', async (req, res, next) => {
  try {
    const user_id = 1;
    const { cluster_id } = req.params;
    const cluster = await clustersController.getCluster(cluster_id);
    const data = {
        resources: cluster.resources - 1,
    }
    const result = await clustersController.decreaseResource(cluster_id, data);
    const orderStatus = await ordersController.createOrder({ user_id, cluster_id })
    res.json({
        message: 'cluster reserved',
        result: { result, orderStatus }
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'not found'
        })
  }
});

    //unreserve cluster
router.patch('/unreserve/:order_id', async (req, res, next) => {
  try {
    const user_id = 1;
    const { order_id } = req.params;
    const order = await ordersController.getOrder(order_id);
    const cluster = await clustersController.getCluster(order.cluster_id);
    const data = {
        resources: cluster.resources + 1,
    }
    const result = await clustersController.increaseResource(order.cluster_id, data);
    const orderStatus = await ordersController.deleteOrder( order_id )
    res.json({
        message: 'cluster unreserved',
        result: { result, orderStatus }
    })
  } catch (error) {
        console.log(error);
        res.json({
            message: 'not found'
        })
  }
});




module.exports = router;