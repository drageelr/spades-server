'use strict'

var Joi = require('joi');

exports.registerSchema = {
    create: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8).max(128),
            name: Joi.string().required().min(3).max(50) 
        }
    }
}

exports.loginSchema = {
    create: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required().min(8).max(128),
        }
    }
}