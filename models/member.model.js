'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    memberID: {
        type: Number,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 13
    },
    gender: {
        type: String,
        required: true
    },
    accomodation: {
        type: Boolean,
        required: true
    },
    cnic: {
        type: String,
        required: true
    },
    firstNameGaurdian: {
        type: String,
        required: true
    },
    lastNameGaurdian: {
        type: String,
        required: true
    },
    phoneGaurdian: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Member', memberSchema);