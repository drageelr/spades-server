'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Admin = require('../models/admin.model');
var Event = require('../models/event.model');

var jwt = require('../services/jwt');

const password = 'iamhammad';

const tprop = ['_id','teamID', 'name', 'email', 'verified', 'paid'];

function validateSearchParams(params)
{
    const sprop = {teamID: true, name: true, email: true, verified: true, paid: true, instName: true, memberFirstName: true};
    return sprop[params.search.via];
}

exports.search = async (req, res, next) =>
{
    let params = req.body;
    /*
        params = {
            search: {
                via: 'Search via',
                value: 'Searching Value'
            }
        }
    */

    let validated = validateSearchParams(params);
    if(!validated)
    {
        res.json({status: 400, message: 'Invalid Search Parameters'});
        return null;
    }

    try
    {
        let resObj = {status: 200, message: 'Successful!', teams: []};

        if(params.search.via != 'instName' && params.search.via != 'memberName')
        {
            if(params.search.via == 'verified' || params.search.via == 'paid')
            {
                if(params.search.value == 'Y')
                {
                    params.search.value = true;
                }
                else
                {
                    params.search.value = false;
                }
            }
            let teams = await Team.find({[params.search.via]: params.search.value, registered: true});
            for(let i = 0; i < teams.length; i++)
            {
                resObj.teams[i] = {};
                for(let x of tprop)
                {
                    resObj.teams[i][x] = teams[i][x];
                }
            }
        }
        else if(params.search.via == 'instName')
        {
            let insts = await Inst.find({name: params.search.value});
            for(let i = 0; i < insts.length; i++)
            {
                let teams = await Team.find({_id: insts[i].teamID});
                for(let j = 0; j < teams.length; j++)
                {
                    resObj.teams[j] = {};
                    for(let x of tprop)
                    {
                        resObj.teams[j][x] = teams[j][x];
                    }
                }
            }
        }
        else if(params.search.via == 'memberName')
        {
            let members = await Member.find({firstName: params.search.value});
            for(let i = 0; i < members.length; i++)
            {
                let teams = await Team.find({_id: members[i].teamID});
                for(let j = 0; j < teams.length; j++)
                {
                    resObj.teams[j] = {};
                    for(let x of tprop)
                    {
                        resObj.teams[j][x] = teams[j][x];
                    }
                }
            }
        }
        
        res.json(resObj);
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

exports.login = async (req, res, next) => {
    // Store params
    let params = req.body;

    try
    {
        // Verify credentials of team
        let adminReq = await Admin.findOne({username: params.username, password: params.password});
        if(adminReq)
        {
            if(adminReq.active)
            {
                let tokenReq = jwt.sign(adminReq._id);
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

exports.deleteTeamData = async (req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            let teamReq = await Team.findOne({name: req.query.name});
            if(teamReq)
            {
                Inst.findOneAndDelete({teamID: teamReq._id});
                Member.findOneAndDelete({teamID: teamReq._id});
                Event.findOneAndDelete({teamID: teamReq._id});
                Team.findOneAndDelete({teamID: teamReq._id});
                res.json({status: 200, message: 'Deletion Successful!'});
            }
            else
            {
                res.json({status: 400, message: 'No Such Team Exists!'});
            }
        }
    }
    catch(e)
    {
        console.log(e)
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

exports.activateTeam = async (req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            let teamReq = await Team.findOne({name: req.query.name});
            if(teamReq)
            {
                Team.findOneAndUpdate({name: req.query.name}, {active: true});
            }
            else
            {
                res.json({status: 400, message: 'No Such Team Exists!'});
            }
        }
    }
    catch(e)
    {
        console.log(e)
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}