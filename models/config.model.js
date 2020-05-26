'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
    regLive: {
        required: true,
        type: Boolean
    }
});

module.exports = mongoose.model('Config', configSchema);