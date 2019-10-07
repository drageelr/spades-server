'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var portalController = require('../controllers/portal.controller');
var portalValidation = require('../validations/portal.validation');
const validator = require('express-validation');


router.use('/portal.html', jwt.verify, portalController.checkReg);

router.post('/submit', jwt.verify, validator(portalValidation.portalSchema), portalController.submit);

router.use('/', express.static('portal'));

module.exports = router;