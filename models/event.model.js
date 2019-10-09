'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'Team'
    },
    number: {
        type: Number,
        required: true
    },
    logical: {
        type: String,
    },
    mystery: {
        type: String,
    },
    engineering: {
        type: String,
    },
    drogone: {
        type: Boolean
    },
    explain: {
        type: String,
        required: true,
        maxlength: 150
    },
    ambassadorName: {
        type: String,
    },
    ambassadorPhone: {
        type: String,
        minlength: 11,
        maxlength: 13
    }
});

module.exports = mongoose.model('Event', eventSchema);