'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var portalController = require('../controllers/portal.controller');
var portalValidation = require('../validations/portal.validation');
const validator = require('express-validation');

var configController = require('../controllers/config.controller');


router.use('/portal.html', jwt.verify, portalController.checkReg);

router.post('/submit', jwt.verify, async (req, res, next) =>
{
    let status = await configController.getRegLive();
    if(!status)
    {
        res.redirect('/portal/regClosed.html');
    }
    else
    {
        next();
    }
}, portalController.submit);

router.post('/data', jwt.verify, portalController.viewData);

router.get('/register.html', async (req, res, next) => {
    let status = await configController.getRegLive();
    if(!status)
    {
        res.redirect('/portal/regClosed.html');
        console.log('Transferred!');
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