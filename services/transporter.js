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
        to: emailTarget,
        subject: 'Event Allotment',
        html: `<div>
        <h1>Spades PSIFI Event Allotment</h1>
        <p>
        Dear Participant,<br>
        <br>
        This is to confirm your payment and event allotments for PsiFi XI!<br>
        Congratulations for being a part of the PsiFi family.<br>
        <b>
        Team ID: ${teamID}<br>
        Events Allotted: ${eventCount}<br>
        Logical: ${eventsAllotted.logical}<br>
        Mystery: ${eventsAllotted.mystery}<br>
        Engineering: ${eventsAllotted.engineering}<br>
        Drogone: ${eventsAllotted.drogone}<br>
        </b>
        Please keep in mind the following details upon arrival for PsiFi XI on Day 1.<br>
        You guys need to report at 8am on the 9th of January and submit the required documents and collect their teams’ ID tags, folders and handbooks.<br>
        1) All team members are expected to bring their student ID card/CNIC/B-form/National Identification<br>
        2) All teams are expected to bring a copy of their Paid Vouchers or any other Proof of Payment<br>
        3) Team leaders will confirm their teams’ events, participant details, submit any required<br>
        4) All team members are expected to bring 2 photographs with them to ensure a smooth registrations process and teams participating in DD and SCB are suppose to bring atleast 3 lab coats with them.<br>
        5) Team who opt for accomodations need to submit their original CNIC or Rupees 2000 as a security deposit in order to get a temporary smart card<br>
        <br>
        A final email containing everything related to theme and other details regarding accomodation would be sent to you in the next week.<br>
        <br>
        <b>It is strongly encouraged to download the PSIFI app since all notifications will be conveyed via the app: https://play.google.com/store/apps/details?id=com.spades.psifixi</b><br>
        <br>
        In case of any queries please feel free to contact us at reg.psifi@gmail.com.<br>
        See you this January in the highest of spirits!<br>
        <br>
        Regards,<br>
        Convening Committee,<br>
        SPADES PSIFI
        </p>
        </div>`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Error Email sent: ' + info.response);
        }
    });
}
