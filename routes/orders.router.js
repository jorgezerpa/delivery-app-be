const express = require('express');
const ordersController = require('./../controllers/orders.controller');
const router = express.Router();

    //get orders
router.get('/', async(req, res, next)=>{
    try {
        const result = await ordersController.getOrders();
        res.json({
            message: 'orders of the day',
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

    //get order
router.get('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const result = await ordersController.getOrder(id);
        res.json({
            message: 'order found',
            result: result,
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            message: 'order not found'
        })
    }
})


//create order
router.post('/:cluster_id', async(req, res, next)=>{
    try {
        const user_id = "1"; //id
        const { cluster_id } = req.params;
        const result = await ordersController.createOrder({user_id, cluster_id});
        res.json({
            message: 'order created',
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

    //delete order
router.delete('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const result = await ordersController.deleteOrder(id);
        res.json({
            message: 'order found',
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

module.exports = router;