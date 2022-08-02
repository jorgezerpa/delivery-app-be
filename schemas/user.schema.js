const Joi = require('joi');

const id = Joi.number();
const name = Joi.string();
const email = Joi.string().email();
const user_name = Joi.string();
const password = Joi.string();

const createUserSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    user_name: user_name.required(),
    password: password.required(),
});

const getUserSchema = Joi.object({
    id: id.required(),
})


module.exports = { createUserSchema, getUserSchema }; //getUserSchema works for delete and update too.

