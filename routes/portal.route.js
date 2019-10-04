'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var portalController = require('../controllers/portal.controller');

router.use('/portal.html', jwt.verify, portalController.checkReg, express.static('../portal'));

router.post('/submit', jwt.verify, portalController.submit);
