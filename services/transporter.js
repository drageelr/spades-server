'use strict'

var nodemailer = require('nodemailer');
var config = require('../config/index').variables;

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
        html: `<div><h1>Spades Account Confirmation!</h1><p>Click <a href="${config.host}/api/verify?key=${activationKey}">link</a> to activate your new account.</p></div><div><p>If you didn't sign up for this account then feel free to contact spadesIT1920@gmail.com.</p></div>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}
