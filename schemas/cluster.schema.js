const Joi = require('joi');

const cluster_id = Joi.number();

const reserveClusterSchema = Joi.object({
    cluster_id: cluster_id.required(),
});

module.exports = { reserveClusterSchema };
