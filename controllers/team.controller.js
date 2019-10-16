'use strict'

var uuidv1 = require('uuidv1');
var transporter = require('../services/transporter');
var jwt = require('../services/jwt');
var Team = require('../models/team.model');

exports.register = async (req, res, next) => {
    // Store params
    let params = req.body;

    // Generate activation key
    params.activationKey = uuidv1();
    
    try
    {
        // Check for Duplicate Team
        let duplicateTeam = await Team.findOne({email: params.email});
        if(duplicateTeam)
        {
            res.json({status: 409, message: 'Duplicate Email!'});
        }
        else
        {
            // Save team to database
            let teamObj = new Team({email: params.email, password: params.password, name: params.name, activationKey: params.activationKey, active: false, paid: false, registered: false, verified: false});
            await teamObj.save();

            // Email activation key
            transporter.sendActivationKey(params.email, params.activationKey);
        
            res.json({status: 200, message: 'Account Created!'});
        }
    }
    catch(e)
    {
        console.log(e);
        res.json(e.errors);
    }
}

exports.login = async (req, res, next) => {
    // Store params
    let params = req.body;

    try
    {
        // Verify credentials of team
        let teamReq = await Team.findOne({email: params.email, password: params.password});
        if(teamReq)
        {
            if(teamReq.active)
            {
                let tokenReq = jwt.sign(teamReq._id);
                res.json({status: 200, message: 'Logged In!', token: tokenReq});
            }
            else
            {
                res.json({status: 403, message: 'Account not activated!'});
            }
        }
        else
        {
            res.json({status: 400, message: 'Invalid email or password!'});
        }
    }
    catch(e)
    {
        console.log(e);
        res.json(e.errors);
    }
}

exports.verify = async (req, res, next) => {
    // Store params
    let params = req.query;
    
    try
    {
        // Set team's active status to true
        let teamReq = await Team.findOneAndUpdate({activationKey: params.key}, {active: true});
        if(teamReq)
        {
            res.redirect('http://spades.lums.edu.pk/portal/verified.html');
        }
        else
        {
            res.json({status: 400, message: 'Bad Request'});
        }
    }
    catch(e)
    {
        console.log(e);
        res.json(e.errors);
    }
}

exports.forgotPassword = async (req, res, next) => {
    let params = req.body;
    try
    {
        let team = await Team.findOne({email: params.email}, 'password');
        if(team)
        {
            transporter.sendPassword(params.email, team.password);
        }
        res.json({status: 200, message: 'Successful!'});
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}