'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    round: {
        type: Number,
    },
    startOrg: {
        type: Date,
        required: true
    },
    endOrg: {
        type: Date,
        required: true
    },
    startDelay: {
        type: Number
    },
    endDelay: {
        type: Number
    },
    type: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    desc: {
        type: String 
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);