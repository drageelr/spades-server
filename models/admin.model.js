'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    FEATURES:
    1) Admin Panel - Search + View + Event Allotment
    2) Portal Voucher - View
    3) Excel Sheets
    4) Toggle Reg
    5) User Access

    ADMIN TYPES:
    1) 'IT' -> All 5
    2) 'REG' -> All except 5
    3) 'EVENT' -> 2 + 3 (only their own event)
    4) 'SECURITY' -> 2
    
*/

const adminSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);