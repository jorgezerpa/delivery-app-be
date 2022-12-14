const db = require('../store/mySql');
const boom = require('@hapi/boom');

const TABLE = 'orders';

module.exports = {
    getOrders : async() => {
        const result = await db.list(TABLE);
        return result;
    },
    getOwnOrders : async(user_id) => {
        const result = await db.filterList(TABLE, { user_id });
        return result;
    },
    getOrder : async(id) => {
        const result = await db.get(TABLE, id);
        if(!result) boom.notFound('order not found')
        return result;
    },
    deleteOrder : async(id) => {
        const result = await db.remove(TABLE, id);
        return result;
    },
    createOrder : async(data) => {
        const result = await db.insert(TABLE, data);
        return result;
    },
    decreaseResource : async(cluster, data) => {
        const result = await db.update(TABLE, cluster, data);
        return result;
    },
}