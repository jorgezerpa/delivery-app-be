const express = require('express');
const ordersController = require('../controllers/orders.controller');
const clustersController = require('./../controllers/clusters.controller');
const router = express.Router();
const passport = require('passport');
const authorization = require('../utils/authorization');
const clusterSchema = require('../schemas/cluster.schema');
const validatorHandler = require('../middlewares/validator.handler');
const boom = require('@hapi/boom')
const socket = require('../socket').socket;

    //reset clusters
router.get('/reset',
    passport.authenticate('jwt', { session: false }),
    authorization.checkRoles('admin'),
    async (req, res, next) => {
        try {
            const result = await clustersController.resetClusters();
            res.json({
                message: 'clusters reseted',
                clusters: result
            })
        } 
        catch (e) {
            next(e)       
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
            next(e)
        }
})

    //get cluster
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(clusterSchema.getClusterSchema, 'params'),
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
        next(e)
    }
})

    //reserve cluster
router.patch('/reserve/:cluster_id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(clusterSchema.reserveClusterSchema, 'params'),
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
            const updatedClusterList = await clustersController.listClusters();
            socket.io.emit(`clustersEvent`, updatedClusterList);
            res.json({
                message: 'cluster reserved',
                result: { result, orderStatus }
            })
        } catch (e) {
            next(e)
        }
});

    //unreserve my cluster
router.patch('/unreserve-mine/:order_id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(clusterSchema.unreserveClusterSchema, 'params'),
    async (req, res, next) => {
        try {
            const user_id = req.user.sub;
            const { order_id } = req.params;
            const order = await ordersController.getOrder(order_id);
            if(!order){ next(boom.notFound('order not found')) }
            if(order.user_id !== user_id){
                res.send('unauthorized');
                return;
            }
            const cluster = await clustersController.getCluster(order.cluster_id);
            if(!cluster){ next(boom.notFound('cluster not found')) } //redundant! if theres an order should be a cluster.
            if(cluster.resources>=8){
                throw new Error('error, max resources number hitted')
            }
            const data = {
                resources: cluster.resources + 1,
            }
            const result = await clustersController.increaseResource(order.cluster_id, data);
            const orderStatus = await ordersController.deleteOrder( order_id );
            const myOrders = await ordersController.getOwnOrders(user_id);
            socket.io.emit(`UnreserveEvent`, myOrders);
            res.json({
                message: 'cluster unreserved',
                result: { result, orderStatus }
            })
        } catch (e) {
            next(e)
        }
});

    //unreserve cluster (admin)
router.patch('/unreserve/:order_id',
    passport.authenticate('jwt', { session: false }),
    authorization.checkRoles('admin'),
    validatorHandler(clusterSchema.unreserveClusterSchema, 'params'),
    async (req, res, next) => {
        try {
            const { order_id } = req.params;
            const order = await ordersController.getOrder(order_id);
            if(!order){
                next(boom.notFound('order not found'))
            }
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
        } catch (e) {
            next(e)
        }
});



module.exports = router;