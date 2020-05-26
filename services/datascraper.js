'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Event = require('../models/event.model');

const tprop = ['_id', 'email', 'password', 'name', 'activationKey', 'active', 'registered', 'teamID', 'headDelegateID'];
const iprop = ['teamID', 'type', 'name', 'city', 'email', 'phone', 'principalEmail', 'address', 'country', 'advisor'];
const mprop = ['teamID', 'memberID', 'firstName', 'lastName', 'birthDate', 'email', 'phone', 'gender', 'accomodation', 'cnic', 'firstNameGaurdian', 'lastNameGaurdian', 'phoneGaurdian', 'address', 'city', 'country', 'photo'];
const eprop = ['teamID', 'number', 'logical', 'mystery', 'engineering', 'drogone', 'explain', 'ambassadorName', 'ambassadorPhone'];

exports.AssembleData = async (req, res, next) =>
{
    try
    {
        var resObj = [];
        var teams = await Team.find({}, '-__v');
        for(let i = 0; i < teams.length; i++)
        {
            resObj[i] = {};
            for(let x of tprop)
            {
                resObj[i][x] = teams[i][x];
            }
            if(teams[i].registered)
            {
                resObj[i].inst = {};
                    let inst = await Inst.findOne({teamID: teams[i]._id}, '-_id -__v');
                    for(let x of iprop)
                    {
                        resObj[i].inst[x] = inst[x];
                    }
                    resObj[i].members = [];
                    let members = await Member.find({teamID: teams[i]._id}, '-__v');
                    for(let j = 0; j < members.length; j++)
                    {
                        resObj[i].members[j] = {};
                        for(let x of mprop)
                        {
                            if(x != '_id')
                            {
                                resObj[i].members[j][x] = members[j][x];
                            }
                            else
                            {
                                resObj[i].members[j][x] = members[j][x].toString();
                            }
                        }
                    }
                    resObj[i].event = {};
                    let event = await Event.findOne({teamID: teams[i]._id}, '-_id -__v');
                    for(let x of eprop)
                    {
                        resObj[i].event[x] = event[x]; 
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