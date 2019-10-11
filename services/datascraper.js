'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/team.model');
var Member = require('../models/team.model');
var Event = require('../models/team.model');

exports.AssembleData = async (req, res, next) =>
{
    try
    {
        var resObj = {status: 200, message: "Successful!", teams: []};
        var teams = await Team.find({}, '-__v');
        for(let i = 0; i < teams.length; i++)
        {
            resObj.teams[i] = {};
            for(let x in teams[i])
            {
                resObj.teams[i][x] = teams[i][x];
            }
            resObj.teams[i].inst = {};
            let inst = await Inst.findOne({teamID: teams[i]._id}, '-__v');
            for(let x in inst)
            {
                resObj.teams[i].inst[x] = inst[x];
            }
            resObj.teams[i].members = [];
            let members = await Member.find({teamID: teams[i]._id}, '-__v');
            for(let j = 0; j < members.length; j++)
            {
                resObj.teams[i].members[j] = {};
                for(let x in members[j])
                {
                    resObj.teams[i].members[j][x] = members[j][x];
                }
            }
            resObj.teams[i].event = {};
            let event = await Event.findOne({teamID: teams[i]._id}, '-__v');
            for(let x in event)
            {
                resObj.teams[i].event[x] = event[x]; 
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