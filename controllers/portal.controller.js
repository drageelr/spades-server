'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Event = require('../models/event.model');
var Counter = require('../models/counter.model');

async function getTeamNum()
{
    try
    {
        let counter = await Counter.find({});
        if(!counter[0])
        {
            let counterObj = new Counter({count: 1});
            await counterObj.save();
            return 1;
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
                country: 'Member Country'
            }],
            event: {
                number: Number of events,
                logical: 'Logical Event',
                mystery: 'Mystery Event',
                engineering: 'Engineering Event',
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
        const idPrefixObj = {School: 'S', University: 'U', Privately: 'P'};

        let temaIDString = 'PSI-';

        for(let p in idPrefixObj)
        {
            if(params.inst.type == p)
            {
                temaIDString += idPrefixObj[p] + '-';
                break;
            }
        }

        temaIDString += await getTeamNum();

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
            if(params.headDelegate.id == i - 1)
            {
                headDID = saved._id;
            }
        }

        await Team.findByIdAndUpdate(params._id, {registered: true, headDelegateID: headDID, teamID: temaIDString});

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
            res.json({status: 200, message: 'You have already submitted the form!'});
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({status: 500, message: 'Internal Server Error!'});
    }
}