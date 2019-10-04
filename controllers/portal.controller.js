'use strict'

var Team = require('../models/team.model');
var Inst = require('../models/inst.model');
var Member = require('../models/member.model');
var Event = require('../models/event.model');

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
            }
        }
    */

    try
    {
        params.inst.teamID = params._id;
        let instObj = new Inst(params.inst);
        await instObj.save()

        params.event.teamID = params._id;
        let eventObj = new Event(params.event);
        await eventObj.save();

        for(let i = 0; i < params.member.length; i++)
        {
            params.member[i].teamID = params._id;
            params.member[i].birthDate = new Date(params.member[i].birthDate);
            let memberObj = new Member(params.member[i]);
            await memberObj.save();
        }

        res.json({status: 200, message: 'Succesful'});

    }
    catch(e)
    {
        console.log(e);
        
        res.json({status: 500, message: 'Internal Server Error!'});
    }

    
}