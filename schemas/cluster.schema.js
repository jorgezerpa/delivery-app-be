const Joi = require('joi');

const cluster_id = Joi.number();
const order_id = Joi.number();

const reserveClusterSchema = Joi.object({
    cluster_id: cluster_id.required(),
});
const unreserveClusterSchema = Joi.object({
    order_id: order_id.required(),
});
const getClusterSchema = Joi.object({
    id: cluster_id.required(),
});

module.exports = { reserveClusterSchema, unreserveClusterSchema, getClusterSchema };
