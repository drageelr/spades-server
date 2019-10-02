'use strict'

var router = require('express').Router();
var teamController = require('../controllers/team.controller');
var teamValidation = require('../validations/team.validation');
var validator = require('../services/validator');
var jwt = require('../services/jwt');

router.get('/test', (req, res, next) => {
    res.json({status: 200, message: "Server Working!"});
});

router.post('/register/page', (req, res, next) => {

});

router.post('/login/page', (req, res, next) => {

});

router.post('/register/submit', /*validator.validate(teamValidation.registerSchema),*/ teamController.register);

router.post('/login/submit', /*validator.validate(teamValidation.loginSchema),*/ teamController.login);

router.get('/verify', teamController.verify);

router.get('/user', jwt.verify ,(req, res, next) => {
    res.json({status: 200, message: 'User Authorized!'});
});

module.exports = router;