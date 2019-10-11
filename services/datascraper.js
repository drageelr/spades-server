'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Event = require('../models/event.model');
var fs = require('fs');

exports.AssembleData = async (req, res, next) =>
{
    try
    {
        var resObj = {teams: []};
        var teams = await Team.find({}, '-__v');
        for(let i = 0; i < teams.length; i++)
        {
            resObj.teams[i] = {};
            for(let x in teams[i])
            {
                resObj.teams[i][x] = teams[i][x];
            }
            if(teams[i].registered)
            {
                resObj.teams[i].inst = {};
                    let inst = await Inst.findOne({teamID: teams[i]._id}, '-_id -__v');
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
                            if(x != '_id')
                            {
                                resObj.teams[i].members[j][x] = members[j][x];
                            }
                            else
                            {
                                resObj.teams[i].members[j][x] = members[j][x].toString();
                            }
                        }
                    }
                    resObj.teams[i].event = {};
                    let event = await Event.findOne({teamID: teams[i]._id}, '-_id -__v');
                    for(let x in event)
                    {
                        resObj.teams[i].event[x] = event[x]; 
                    }
                }
            }

            fs.appendFile('data.txt', JSON.stringify(resObj, null, 4), (err) =>
            {
                if (err)
                {console.log(err)}
                else
                {
                    console.log("Wrote to file!");
                }
                
            })

        res.json({status: 200, message: "Successful!"});
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}