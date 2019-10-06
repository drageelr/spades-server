'use strict'

var Joi = require('joi');

exports.portalSchema = {
    create: {
        body: {
            inst: {
                type: Joi.string().required().min(6).max(10),
                name: Joi.string().required().min(3).max(50),
                city: Joi.string().required().min(3).max(50),
                email: Joi.string().required().email(),
                phone: Joi.string().required().min(11).max(13),
                principalEmail: Joi.string().required().email(),
                address: Joi.string().required().min(10).max(150),
                country: Joi.string().required().min(3).max(50),
                advisor: Joi.boolean().required()
            },
            member: [{
                firstName: Joi.string().required().min(3).max(50),
                lastName: Joi.string().required().min(3).max(50),
                birthDate: Joi.string().required().min(8).max(10),
                email: Joi.string().required().email(),
                phone: Joi.string().required().min(11).max(13),
                gender: Joi.string().required().min(4).max(6),
                accomodation: Joi.boolean().required(),
                cnic: Joi.string().required().min(13).max(15),
                firstNameGaurdian: Joi.string().required().min(3).max(50),
                lastNameGaurdian: Joi.string().required().min(3).max(50),
                phoneGaurdian: Joi.string().required().min(11).max(13),
                address: Joi.string().required().min(10).max(150),
                city: Joi.string().required().min(3).max(50),
                country: Joi.string().required().min(3).max(50)
            }],
            event: {
                number: Joi.number().required(),
                logical: Joi.string().min(3).max(50),
                mystery: Joi.string().min(3).max(50),
                engineering: Joi.string().min(3).max(50),
                explain: Joi.string().required().min(1).max(150),
                ambassadorName: Joi.string().min(3).max(50),
                ambassadorPhone: Joi.string().min(3).max(50)
            },
            headDelegate: {
                id: Joi.number().required()
            }
        }
    }
}