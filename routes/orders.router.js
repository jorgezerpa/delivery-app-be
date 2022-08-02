const express = require('express');
const ordersController = require('./../controllers/orders.controller');
const router = express.Router();
const passport = require('passport');
const authorization = require('../utils/authorization');



    //get orders
router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorization.checkRoles('admin'),
    async(req, res, next)=>{
    try {
        const result = await ordersController.getOrders();
        res.json({
            message: 'orders of the day',
            result: result,
        })
    }
    catch (e) {
        next(e)
    }
})

    //get my orders
router.get('/my-orders',
    passport.authenticate('jwt', { session: false }),
    async(req, res, next)=>{
    try {
        const id = req.user.sub;
        const result = await ordersController.getOwnOrders(id);
        res.json({
            message: 'orders of the day',
            result: result,
        })
    }
    catch (e) {
        next(e)
    }
})



//create order
//nos used, delete magaged from clusters
// router.post('/:cluster_id',
//     passport.authenticate('jwt', { session: false }),
//     async(req, res, next)=>{
//     try {
//         const user_id = req.user.sub; //id
//         const { cluster_id } = req.params;
//         const result = await ordersController.createOrder({user_id, cluster_id});
//         res.json({
//             message: 'order created',
//             result: result,
//         })
//     }
//     catch (e) {
//         console.log(e)
//         res.json({
//             message: 'cluster not found'
//         })
//     }
// })

    //delete order
    //nos used, delete magaged from clusters
// router.delete('/:id',
//     passport.authenticate('jwt', { session: false }),
//     async(req, res, next)=>{
//     try {
//         const { id } = req.params; //order id
//         const result = await ordersController.deleteOrder(id);
//         res.json({
//             message: 'order found',
//             result: result,
//         })
//     }
//     catch (e) {
//         console.log(e)
//         res.json({
//             message: 'order not found'
//         })
//     }
// })

module.exports = router;