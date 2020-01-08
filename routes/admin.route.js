'use strict'

var express = require('express');
var router = express.Router();
var jwt = require('../services/jwt');
var adminController = require('../controllers/admin.controller');
var portalController = require('../controllers/portal.controller');

// Admin Login APIs

router.get('/admin.html', jwt.verifyAdmin);

router.post('/login/submit', adminController.login);

// Admin Panel APIs

router.post('/search', jwt.verifyAdmin, adminController.search);

router.post('/togglePaid', jwt.verifyAdmin, adminController.togglePaid);

router.post('/toggleVerify', jwt.verifyAdmin, adminController.toggleVerify);

router.get('/adminpanel.html', jwt.verifyAdmin);

// Admin Voucher APIs

router.post('/data', jwt.verifyAdmin, portalController.viewData);

router.post('/allotEvents', jwt.verifyAdmin, adminController.allotEvents);

router.post('/changephoto', jwt.verifyAdmin, adminController.changePhoto);

// Admin Excel Sheets APIs

router.get('/sheets.html', jwt.verifyAdmin);

router.get('/getAllInfo', jwt.verifyAdmin, adminController.getAllInfo);

// Admin Schedule APIs

router.post('/getSchedule', adminController.getSchedule);

router.post('/setDelay', jwt.verifyAdmin, adminController.setDelay);

router.post('/addSchedule', adminController.addSchedule);

// QR Code APIs

router.post('/loginQR/submit', adminController.teamQR);

router.get('/voucherQR.html', jwt.verify);

router.get('/team/:type/:tID', (req, res, next) => {
    res.redirect('/admin/loginQR.html?type=' + req.params.type + '&tID=' + req.params.tID);
});

// URL Operated APIs

router.get('/evalform', adminController.sendEvalForm);

router.get('/fixTeams', adminController.fixInvalidTeams);

router.get('/getAllDel', adminController.getAllDel);

router.get('/toggleReg', adminController.toggleReg);

// router.get('/getHeadDelegates', adminController.getHeadEmails);

// router.get('/delete', adminController.deleteTeamData);

// router.get('/activate', adminController.activateTeam);

// router.get('/cteamID', adminController.changeTeamID);




router.use('/', express.static('admin'));


module.exports = router;