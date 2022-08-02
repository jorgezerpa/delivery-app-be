const express = require('express');
const ordersController = require('../controllers/orders.controller');
const clustersController = require('./../controllers/clusters.controller');
const router = express.Router();
const passport = require('passport');
const authorization = require('../utils/authorization');

    //reset clusters
router.get('/reset',
    passport.authenticate('jwt', { session: false }),
    authorization.checkRoles('admin'),
    async (req, res, next) => {
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
router.get('/',
    passport.authenticate('jwt', { session: false }),
    async(req, res, next)=>{
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
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    async(req, res, next)=>{
    const { id } = req.params; //cluster id
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
router.patch('/reserve/:cluster_id',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const user_id = req.user.sub;
            const { cluster_id } = req.params;
            const cluster = await clustersController.getCluster(cluster_id);
            if(cluster.resources<=0){
                throw new Error('no available resources')
            }
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

    //unreserve my cluster
router.patch('/unreserve-mine/:order_id',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const user_id = req.user.sub;
            const { order_id } = req.params;
            const order = await ordersController.getOrder(order_id);
            if(order.user_id !== user_id){
                res.send('unauthorized');
                return;
            }
            const cluster = await clustersController.getCluster(order.cluster_id);
            if(cluster.resources>=8){
                throw new Error('error, max resources number hitted')
            }
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

    //unreserve cluster (admin)
router.patch('/unreserve/:order_id',
    passport.authenticate('jwt', { session: false }),
    authorization.checkRoles('admin'),
    async (req, res, next) => {
        try {
            const { order_id } = req.params;
            const order = await ordersController.getOrder(order_id);
            const cluster = await clustersController.getCluster(order.cluster_id);
            if(!cluster.resources>=8){
                throw new Error('error, max resources number hitted')
            }
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