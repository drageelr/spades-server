'use strict'

var config = require('../config/index').variables;
var jwt = require('jsonwebtoken');
var Team = require('../models/team.model');

exports.sign = (payload) => {
    return jwt.sign({_id: payload}, config.secretKey, {expiresIn: '1h'});
}

let verification = (token) =>
{
    try
    {
        let decoded = jwt.verify(token, config.secretKey);
        return decoded;
    }
    catch(e)
    {
        console.log(e);
        return undefined;
    }
}

exports.verify = async (req, res, next) => {
    let token = req.url.substring(8);
    // if(req.headers.authorization)
    // {
    //     token = req.headers.authorization.substring(7); 
    // }
    let decoded = verification(token);
    if(decoded)
    {
        let _id = decoded._id;
        let teamReq = await Team.findById(_id);
        if(teamReq)
        {
            req.body._id = teamReq._id;
            next();
        }
        else
        {
            res.json({status: 400, message: 'Invalid Token!'});
        }
    }
    else
    {
        res.json({status: 400, message: 'Invalid Token!'});
    }
}