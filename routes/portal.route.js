'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var portalController = require('../controllers/portal.controller');
var portalValidation = require('../validations/portal.validation');
const validator = require('express-validation');

var configController = require('../controllers/config.controller');


router.use('/portal.html', jwt.verify, portalController.checkReg);

router.post('/submit', jwt.verify, (req, res, next) =>
{
    if(!configController.getRegLive())
    {
        res.redirect('/portal/regClosed.html');
    }
    else
    {
        next();
    }
}, portalController.submit);

router.post('/data', jwt.verify, portalController.viewData);

router.get('/register.html', (req, res, next) => {
    if(!configController.getRegLive())
    {
        res.redirect('/portal/regClosed.html');
    }
    else
    {
        next();
    }
})

router.get('/regClosed.html', (req, res, next) => {
    res.redirect('/sitedown/temp.html')
})

router.use('/', express.static('portal'));

module.exports = router;