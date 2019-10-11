'use strict'

var config = require('../config/index').variables;

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

mongoose.connection.on('connected', () => {
console.log('MongoDB is connected')
})

mongoose.connection.on('error', (err) => {
console.log(`Could not connect to MongoDB because of ${err}`)
process.exit(1)
})

exports.connect = () => {
var mongoURI = 'mongodb://localhost:27017/' + config.db;
console.log('mongoURI: ' + mongoURI);
mongoose.connect(mongoURI, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

return mongoose.connection
}
