'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var adminController = require('../controllers/admin.controller');
var portalController = require('../controllers/portal.controller');

router.post('/login/submit', adminController.login);

router.post('/search', jwt.verifyAdmin, adminController.search);

router.post('/data', jwt.verifyAdmin, portalController.viewData);

//router.get('/dataQR', jwt.verify, portalController.viewData);

router.post('/changephoto', jwt.verifyAdmin, adminController.changePhoto);

router.get('/admin.html', jwt.verifyAdmin);

router.get('/delete', adminController.deleteTeamData);

router.get('/activate', adminController.activateTeam);

router.get('/cteamID', adminController.changeTeamID);

router.get('/evalform', adminController.sendEvalForm);

router.get('/fixTeams', adminController.fixInvalidTeams);

router.get('/getHeadDelegates', adminController.getHeadEmails);

router.get('/getAllInfo', adminController.getAllInfo);

//router.get('/member/:inst/:tID/:mID');

//router.get('/team/:type/:tID', adminController.teamQR);

router.use('/', express.static('admin'));


module.exports = router;