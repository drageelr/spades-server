'use strict'

var router = require('express').Router();
var teamController = require('../controllers/team.controller');
var teamValidation = require('../validations/team.validation');
const validator = require('express-validation');
var jwt = require('../services/jwt');

var configController = require('../controllers/config.controller');

router.get('/test', (req, res, next) => {
    res.json({status: 200, message: "Server Working!"});
});

router.post('/register/submit', (req, res, next) => {
    let status = await configController.getRegLive();
    if(!status)
    {
        res.redirect('/portal/regClosed.html');
    }
    else
    {
        next();
    }
}, validator(teamValidation.registerSchema), teamController.register);

router.post('/login/submit', validator(teamValidation.loginSchema), teamController.login);

router.get('/verify', teamController.verify);

router.post('/forgotpassword', teamController.forgotPassword);

router.get('/user', jwt.verify ,(req, res, next) => {
    res.json({status: 200, message: 'User Authorized!'});
});

module.exports = router;