'use strict'

const Config = require('../models/config.model');

async function configCheck()
{
    let config = await Config.find({});
    if(!config[0])
    {
        let configObj = new Config({regLive: true});
        await configObj.save();
        return true;
    }
    else
    {
        return config[0].regLive;
    }
}

exports.start = async () =>
{
    await configCheck();
}