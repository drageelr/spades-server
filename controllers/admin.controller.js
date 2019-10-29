'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Admin = require('../models/admin.model');
var Event = require('../models/event.model');
var jwt = require('../services/jwt');
var transporter = require('../services/transporter');
const { parseAsync } = require('json2csv');
const fs = require('fs');

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
            
            // Store TeamIDs seperately
            let teamIDs = [];
            for(let i = 0; i < teams.length; i++)
            {
                teamIDs[i] = {};
                teamIDs[i].teamID = teams[i].teamID;
                teamIDs[i].ID = teams[i].teamID.substr(teams[i].teamID.length - 5, 5);
                teamIDs[i].index = i;
            }

            // // Printing Sorted Stuff:
            // console.log('Pre-Printing:');
            // for(let i = 0; i < teamIDs.length; i++)
            // {
            //     console.log('idArr[' + i + ']: ' + ' teamID: ' + teamIDs[i].teamID + ' index: ' + teamIDs[i].index);
            // }


            // Sort TeamIDs
            for(let i = 0; i < teamIDs.length; i++)
            {
                for(let j = 0; j < teamIDs.length - i - 1; j++)
                {
                    if(teamIDs[j].ID > teamIDs[j + 1].ID)
                    {
                        let tempTID = teamIDs[j].teamID;
                        let tempID = teamIDs[j].ID;
                        let tempI = teamIDs[j].index;
                        teamIDs[j].teamID = teamIDs[j + 1].teamID;
                        teamIDs[j].ID = teamIDs[j + 1].ID;
                        teamIDs[j].index = teamIDs[j + 1].index;
                        teamIDs[j + 1].teamID = tempTID;
                        teamIDs[j + 1].ID = tempID;
                        teamIDs[j + 1].index = tempI;
                    }
                }
            }

            // // Printing Sorted Stuff:
            // console.log('Post-Printing:');
            // for(let i = 0; i < teamIDs.length; i++)
            // {
            //     console.log('idArr[' + i + ']: ' + ' teamID: ' + teamIDs[i].teamID + ' index: ' + teamIDs[i].index);
            // }


            for(let i = 0; i < teams.length; i++)
            {
                resObj.teams[i] = {};
                for(let x of tprop)
                {
                    if(x != 'teamID')
                    {
                        resObj.teams[i][x] = teams[teamIDs[i].index][x];
                    }
                    else
                    {
                        resObj.teams[i].teamID = teamIDs[i].teamID;
                    }
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
                await Inst.findOneAndDelete({teamID: teamReq._id});
                let member = await Member.findOneAndDelete({teamID: teamReq._id});
                while(member)
                {
                    member = await Member.findOneAndDelete({teamID: teamReq._id});
                }
                await Member.findOneAndDelete({teamID: teamReq._id});
                await Event.findOneAndDelete({teamID: teamReq._id});
                await Team.findOneAndDelete({_id: teamReq._id});
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
                await Team.findOneAndUpdate({name: req.query.name}, {active: true});
                res.json({status: 200, message: 'Account Activated!'});
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

exports.changeTeamID = async(req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            let teamReq = await Team.findOne({name: req.query.name});
            if(teamReq)
            {
                await Team.findOneAndUpdate({name: req.query.name}, {teamID: 'PSI-' + req.query.inst + '-' + req.query.num});
                res.json({status: 200, message: 'Team ID changed!'});
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

exports.changePhoto = async (req, res, next) =>
{
    let params = req.body;

    if(params.photo && params.teamID && params.memberID)
    {
        let teamReq = await Team.findOne({teamID: params.teamID})
        if(teamReq)
        {
            let saveMember = await Member.findOneAndUpdate({teamID: teamReq._id, memberID: params.memberID}, {photo: params.photo, photoChangedBy: params.adminUsername});
            if(saveMember)
            {
                res.json({status: 200, message: 'Photo Updated Successfuly!'});
            }
            else
            {
                res.json({status: 404, message: 'Member not found!'});
            }
        }
        else
        {
            res.json({status: 404, message: 'Team not found!'});
        }
    }
    else
    {
        res.json({status: 400, message: 'Bad Request!'});
    }
}

exports.sendEvalForm = async (req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            if(req.query.email)
            {
                transporter.sendEvalForm(req.query.email);
                res.json({status: 200, message: 'Form Sent!'});
            }
            else if(req.query.name)
            {
                let teamReq = await Team.findOne({name: req.query.name}, 'email');
                if(teamReq)
                {
                    if(teamReq.registered)
                    {
                        transporter.sendEvalForm(teamReq.email);
                        res.json({status: 200, message: 'Form Sent!'});
                    }
                    else
                    {
                        res.json({status: 400, message: 'Team did not register!'});
                    }
                }
                else
                {
                    res.json({status: 400, message: 'No Such Team Exists!'});
                }
            }
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

exports.fixInvalidTeams = async (req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            let resObj = {status: 200, message: 'Team(s) Fixed!', teamEmails: []};
            let teams = await Team.find({registered: false});
            let counter = 0;
            for(let i = 0; i < teams.length; i++)
            {
                let inst = await Inst.findOneAndDelete({teamID: teams[i]._id});
                let event = await Event.findOneAndDelete({teamID: teams[i]._id});
                let member = await Member.findOneAndDelete({teamID: teams[i]._id});
                let fixrequired = false;
                if(inst || event || member)
                {
                    fixrequired = true;
                }
                while(member)
                {
                    member = await Member.findOneAndDelete({teamID: teams[i]._id});
                }
                if(fixrequired)
                {
                    resObj.teamEmails[counter] = teams[i].email;
                    counter++;
                }
            }
            if(counter == 0)
            {
                res.json({status: 400, message: 'No teams need to be fixed!'});
            }
            else
            {
                res.json(resObj);
            }
        }
    }
    catch(e)
    {
        console.log(e)
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

exports.getHeadEmails = async (req, res, next) =>
{
    try
    {
        if(password == req.query.pass)
        {
            let csvFields = ['#', 'name', 'email', 'phone'];
            let csvFieldsObj = {csvFields};
            let csvObj = {'#': {}, name: {}, email: {}, phone: {}};
            let teams = await Team.find({registered: true}, 'headDelegateID');
            let membersHead = await Member.find({_id: teams.headDelegateID}, 'name email phone');
            for(let i = 0; i < membersHead.length; i++)
            {
                csvObj['#'][i] = i;
                csvObj.name[i] = membersHead[i].name;
                csvObj.email[i] = membersHead[i].email;
                csvObj.phone[i] = membersHead[i].phone;
            }

            const path = './temp/HeadDelegates.csv'

            parseAsync(csvObj, csvFieldsObj)
            .then(csv => {
                fs.writeFile(path, csv, (er, data) => {
                    if(er)
                    {
                        res.json({status: 999, message: 'Failure to Create File!'});
                    }
                    else
                    {
                        res.download(path);
                    }
                });
            })
            .catch(err => console.error(err));
            
        }
    }
    catch(e)
    {
        console.log(e)
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}