'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Event = require('../models/event.model');
var Counter = require('../models/counter.model');

var transporter = require('../services/transporter');

async function getTeamNum()
{
    try
    {
        let counter = await Counter.find({});
        if(!counter[0])
        {
            let counterObj = new Counter({count: 1});
            await counterObj.save();
            return '00001';
        }
        else
        {
            let num = counter[0].count + 1;
            let numString = '';
            await Counter.findByIdAndUpdate(counter[0]._id, {count: num});
            if(num < 10)
            {
                numString += '0000' + num;
            }
            else if (num < 100)
            {
                numString += '000' + num;
            }
            else if(num < 1000)
            {
                numString += '00' + num;
            }
            else
            {
                numString += '0' + num;
            }
            return numString;
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

function submitValidation(params) 
{
    let instVal = {type: true, name: true, city: true, email: true, phone: true, principalEmail: true, address: true, country: true, advisor: true};
    let memberVal = {firstName: true, lastName: true, birthDate: true, email: true, phone: true, gender: true, accomodation: true, cnic: true, firstNameGaurdian: true, lastNameGaurdian: true, phoneGaurdian: true, address: true, city: true, country: true, photo: true};
    //let eventVal = {number: true, logical: true, mystery: true, engineering: true, ambassadorName: true, ambassadorPhone: true};
    //let headDelegateVal = {id: true};

    for(let i in params.inst)
    {
        if(instVal[i] == undefined)
        {
            return {ok: false, error: 'inst.' + i};
        }
    }

    for(let i = 0; i < params.member.length; i++)
    {
        for(let m in params.member[i])
        {
            if(memberVal[m] == undefined)
            {
                return {ok: false, error: 'member[' + i + '].' + m};
            }
        }
    }

    return {ok: true, error: 'Nothing'};
}

exports.submit = async (req, res, next) =>
{
    let params = req.body;
    
    /*
        params = {
            inst: {
                type: 'School/Private/University',
                name: 'Institution Name',
                city: 'City Name',
                email: 'Institution Email',
                phone: 'Institution Phone',
                principalEmail: 'Principal Email',
                address: 'Institution Address',
                country: 'Institution Country',
                advisor: true/false
            },
            member: [{
                firstName: 'Member First Name', 
                lastName: 'Member Last Name',
                birthDate: 'Member birth date in YYYY-MM-DD',
                email: 'Member Email',
                phone: 'Member Phone',
                gender: 'Male/Female/Other',
                accomodation: true/false,
                cnic: 'Member CNIC',
                firstNameGaurdian: 'Member Gaurdian First Name',
                lastNameGaurdian: 'Member Gaurdian Last Name',
                phoneGaurdian: 'Member Gaurdian Phone',
                address: 'Member Address',
                city: 'Member City',
                country: 'Member Country',
                photo: 'Byte64 encoded photo',
            }],
            event: {
                number: Number of events,
                logical: 'Logical Event',
                mystery: 'Mystery Event',
                engineering: 'Engineering Event',
                drogone: 'Boolean Value',
                explain: 'Explaination of event choice (max 150 words)',
                ambassadorName: 'Ambassador Name (if any)',
                ambassadorPhone: 'Ambassador Phone (if any)'
            },
            headDelegate: {
                id: 'Head Delegate ID (1 for first, 2 for second and so on...)'
            }
        }
    */

    try
    {

        let teamReq = await Team.findById(params._id, 'registered email');
        if(teamReq.registered)
        {
            res.json({status: 200, message: 'Form Already Submitted!'});
            return null;
        }

        let errorObj = submitValidation(params);

        if(!errorObj.ok)
        {
            res.json({status: 400, message: errorObj.error});
            return null;
        }

        const idPrefixObj = {School: 'S', University: 'U', Privately_Uni: 'PU', Privately_Sch: 'PS'};

        let teamIDString = 'PSI-';

        for(let p in idPrefixObj)
        {
            if(params.inst.type == p)
            {
                teamIDString += idPrefixObj[p] + '-';
                break;
            }
        }

        params.inst.teamID = params._id;
        let instObj = new Inst(params.inst);
        await instObj.save()

        params.event.teamID = params._id;
        let eventObj = new Event(params.event);
        await eventObj.save();

        let headDID;

        for(let i = 0; i < params.member.length; i++)
        {
            params.member[i].teamID = params._id;
            params.member[i].birthDate = new Date(params.member[i].birthDate);
            params.member[i].memberID = i + 1;
            let memberObj = new Member(params.member[i]);
            let saved = await memberObj.save();
            if(params.headDelegate.id == i + 1)
            {
                headDID = saved._id;
            }
        }

        teamIDString += await getTeamNum();

        await Team.findByIdAndUpdate(params._id, {registered: true, headDelegateID: headDID, teamID: teamIDString});

        transporter.sendEvalForm(teamReq.email);

        res.json({status: 200, message: 'Succesful'});

    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }

    
}

exports.checkReg = async (req, res, next) =>
{
    try
    {
        let teamReq = await Team.findById(req.body._id);
        if(!teamReq.registered)
        {
            next();
        }
        else
        {
            res.redirect('/portal/voucher.html');
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}

exports.viewData = async (req, res, next) =>
{
    try
    {
        let resObj = {status: 200, message: 'Successful!'};
        let _id = req.body._id;

        let teamReq = await Team.findById(_id);
        let instReq = await Inst.findOne({teamID: _id}, '-teamID -__v -_id');
        let eventReq = await Event.findOne({teamID: _id}, '-teamID -__v -_id');
        let membersReq = await Member.find({teamID: _id}, '-teamID -__v -_id');
        let membersReqID = await Member.find({teamID: _id}, '_id');

        resObj.teamID = teamReq.teamID;
        resObj.timestamp = instReq.createdAt;
        instReq.createdAt = undefined;
        instReq.updatedAt = undefined;
        resObj.inst = instReq;
        resObj.event = eventReq;
        resObj.member = [];
        for(let i = 0; i < membersReq.length; i++)
        {
            if(teamReq.headDelegateID.toString() == membersReqID[i]._id.toString())
            {
                resObj.headDelegate = {
                    id: i + 1
                }
            }
            resObj.member[i] = membersReq[i];
        }

        res.json(resObj);
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}