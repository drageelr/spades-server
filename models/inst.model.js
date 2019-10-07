'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instSchema = new Schema({
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'Team'
    },
    type: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 10
    },
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    city: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 13
    },
    principalEmail: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    advisor: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inst', instSchema);