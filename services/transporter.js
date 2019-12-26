'use strict'

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'noreplyspades@gmail.com',
    pass: '@.spades.@'
}
});



exports.sendActivationKey = (emailTarget, activationKey) => {
    var mailOptions = {
        from: 'noreply <noreplyspades@gmail.com>',
        to: emailTarget,
        subject: 'Activation Key',
        html: `<div><h1>Spades Account Confirmation!</h1><p>Click <a href="http://spades.lums.edu.pk/api/verify?key=${activationKey}">link</a> to activate your new account.</p></div><div><p>If you didn't sign up for this account then feel free to contact spadesIT1920@gmail.com.</p></div>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

exports.sendPassword = (emailTarget, password) => {
    var mailOptions = {
        from: 'noreply <noreplyspades@gmail.com>',
        to: emailTarget,
        subject: 'Activation Key',
        html: `<div><h1>Spades Forgot Password!</h1><p>Password: ${password}</p></div><div><p>If you didn't send the forgot password request then feel free to contact spadesIT1920@gmail.com.</p></div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendEvalForm = (emailTarget) =>
{
    var mailOptions = {
        from: 'noreply <noreplyspades@gmail.com>',
        to: emailTarget,
        subject: 'Evaluation Form',
        attachments: [
            {
                path: './files/EVALUATION_FORM.docx'
            }
        ],
        html: `<div><h1>Spades Evaluation Form</h1><p>Kindly fill the evaluation form and send it to reg.psifi@gmail.com. Your voucher generation process will start after you submit this form. Failure to submit the form will delay voucher generation which might make your team ineligible for 'Early Bid' discount.</p></div><div><p>Note: Submiting portal form and the evaluation form doesn't ensure your selection. You will get an email if you get selected which would contain further information on generating the payment voucher.</p></div><div><p>If you didn't sign up on for Spades PSIFI event then feel free to contact spadesIT1920@gmail.com.</p></div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendFormError = (emailTeam, nameTeam, errorMsg) =>
{
    var mailOptions = {
        from: 'noreply <noreplyspades@gmail.com>',
        to: 'reg.psifi@gmail.com, spadesIT1920@gmail.com',
        subject: 'Portal Error',
        html: `<div><h1>Spades Portal Form Error</h1><p>Team registered with the <b>Email: ${emailTeam}, Team Name: ${nameTeam}</b>.</p></div><div><p>The error is: ${errorMsg}</p></div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Error Email sent: ' + info.response);
        }
    });
}

exports.sendEventAllotment = (emailTarget, teamID, eventsAllotted, eventCount) =>
{
    var mailOptions = {
        from: 'noreply <noreplyspades@gmail.com>',
        to: 'spadesIT1920@gmail.com', //emailTarget,
        subject: 'Event Allotment',
        html: `<div><h1>Spades Event Allotment</h1><b><p>Team ID: ${teamID} <br> Events Allotted: ${eventCount} <br> Logical: ${eventsAllotted.logical} <br> Mystery: ${eventsAllotted.mystery} <br> Engineering: ${eventsAllotted.engineering} <br> Drogone: ${eventsAllotted.logical} </p></b></div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Error Email sent: ' + info.response);
        }
    });
}
