'use strict'

const Config = require('../models/config.model');

exports.getRegLive = async () =>
{
    let config = await Config.find({});
    if(config[0])
    {
        return config[0].regLive;
    }
    else
    {
        return false;
    }
}