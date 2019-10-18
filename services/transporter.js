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
        html: `<div><h1>Spades Evaluation Form</h1><p>Kindly fill the evaluation form and send it to reg.psifi@gmail.com</p></div><div><p>If you didn't sign up on for Spades PSIFI event then feel free to contact spadesIT1920@gmail.com.</p></div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
