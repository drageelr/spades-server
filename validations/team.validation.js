'use strict'

var Joi = require('@hapi/joi');

exports.registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(128),
    name: Joi.string().required().min(3).max(50) 
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(128), 
});