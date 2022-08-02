const Joi = require('joi');

const id = Joi.number();
const name = Joi.string();
const email = Joi.email();
const user_name = Joi.user_name();
const password = Joi.string();

const createUserSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    user_name: user_name.require(),
    password: password.required(),
});

const getUserSchema = Joi.object({
    id: id.required(),
})


module.exports = { createUserSchema, getUserSchema }; //getUserSchema works for delete and update too.

