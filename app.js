var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./services/mongoose');
var validator = require('./services/validator');
var bodyParser = require('body-parser');

var mainRoute = require('./routes/route');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', mainRoute);
//app.use(validator.validate());

mongoose.connect();

module.exports = app;
