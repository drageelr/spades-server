'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var adminController = require('../controllers/admin.controller');
var portalController = require('../controllers/portal.controller');

router.post('/login/submit', adminController.login);

router.post('/loginQR/submit', adminController.teamQR);

router.post('/search', jwt.verifyAdmin, adminController.search);

router.post('/togglePaid', jwt.verifyAdmin, adminController.togglePaid);

router.post('/toggleVerify', jwt.verifyAdmin, adminController.toggleVerify);

router.post('/data', jwt.verifyAdmin, portalController.viewData);

router.post('/allotEvents', jwt.verifyAdmin, adminController.allotEvents);

//router.get('/dataQR', jwt.verify, portalController.viewData);

router.post('/changephoto', jwt.verifyAdmin, adminController.changePhoto);

router.get('/admin.html', jwt.verifyAdmin);

router.get('/adminpanel.html', jwt.verifyAdmin);

router.get('/sheets.html', jwt.verifyAdmin);

router.get('/voucherQR.html', jwt.verify);

// router.get('/delete', adminController.deleteTeamData);

// router.get('/activate', adminController.activateTeam);

// router.get('/cteamID', adminController.changeTeamID);

router.get('/evalform', adminController.sendEvalForm);

router.get('/fixTeams', adminController.fixInvalidTeams);

// router.get('/getHeadDelegates', adminController.getHeadEmails);

router.get('/getAllInfo', jwt.verifyAdmin, adminController.getAllInfo);

router.get('/getAllDel', adminController.getAllDel);

router.get('/toggleReg', adminController.toggleReg);

//router.get('/member/:inst/:tID/:mID');

router.get('/team/:type/:tID', (req, res, next) => {
    res.redirect('/admin/loginQR.html?type=' + req.params.type + '&tID=' + req.params.tID);
});

router.use('/', express.static('admin'));


module.exports = router;