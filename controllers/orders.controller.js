const db = require('../store/mySql');

const TABLE = 'orders';

module.exports = {
    getOrders : async() => {
        const result = await db.list(TABLE);
        return result;
    },
    getOrder : async(id) => {
        const result = await db.get(TABLE, id);
        if(!result) throw new Error('not found')
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