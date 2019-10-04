'use strict'

var router = require('express').Router();
var teamController = require('../controllers/team.controller');
var portalController = require('../controllers/portal.controller');
var teamValidation = require('../validations/team.validation');
const validator = require('express-validation');
var jwt = require('../services/jwt');

router.get('/test', (req, res, next) => {
    res.json({status: 200, message: "Server Working!"});
});

router.post('/register/page', (req, res, next) => {

});

router.post('/login/page', (req, res, next) => {

});

router.post('/register/submit', validator(teamValidation.registerSchema), teamController.register);

router.post('/login/submit', validator(teamValidation.loginSchema), teamController.login);

router.get('/verify', teamController.verify);

router.get('/user', jwt.verify ,(req, res, next) => {
    res.json({status: 200, message: 'User Authorized!'});
});

router.post('/portal/submit', jwt.verify, portalController.submit);

module.exports = router;