'use strict'

var Joi = require('@hapi/joi');

exports.validate = (schema) => (req, res, next) => {
    let params = req.body;
    let {error, value} = schema.validate(params);
    if(error)
    {
        console.log(error);
        res.json(error);
    }
    else
    {
        next();
    }
}

