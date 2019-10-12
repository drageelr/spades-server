var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./services/mongoose');
var bodyParser = require('body-parser');


var apiRoute = require('./routes/api.route');
var portalRoute = require('./routes/portal.route');
var adminRoute = require('./routes/admin.route');

var datascraper = require('./services/datascraper');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Origin, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

app.get('/datascrape', datascraper.AssembleData);

// app.use('/sitedown', express.static('temp'));

// app.use('/api', (req, res, next) => {
//     res.redirect('/sitedown/temp.html')
// })

// app.use('/portal', (req, res, next) => {
//     res.redirect('/sitedown/temp.html')
// })

app.use('/api', apiRoute);

app.use('/portal', portalRoute);

app.use('/admin', adminRoute);


mongoose.connect();

module.exports = app;
