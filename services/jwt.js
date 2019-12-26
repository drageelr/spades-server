'use strict'

var config = require('../config/index').variables;
var jwt = require('jsonwebtoken');
var Team = require('../models/team.model');
var Admin = require('../models/admin.model');

exports.sign = (payload) => {
    return jwt.sign({_id: payload}, config.secretKey, {expiresIn: '12h'});
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
    let token = req.query.token;
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

exports.verifyAdmin = async (req, res, next) => {
    let token = req.query.token;
    let decoded = verification(token);
    if(decoded)
    {
        let _id = decoded._id;
        let adminReq = await Admin.findById(_id);
        if(adminReq)
        {
            req.body.adminUsername = adminReq.username;
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