'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    activationKey: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);