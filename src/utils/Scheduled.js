const cron = require('node-cron');
const {MessageAttachment} = require('discord.js');
const config = require('../../config.json');
const { rotationData } = require('../assets/data/ObjectCollection');
const botEmbed = require('./EmbedBuilder');
const { DateTime } = require('luxon');

module.exports = class Scheduled {

    dailyRotation(client){
        cron.schedule('0 3 * * *', () => {
            const logch = process.env.DEPLOY == 'DEV' ? client.channels.cache.get(config.devlog) : client.channels.cache.get(config.log)
            const today = DateTime.now().setZone('Asia/Jakarta').weekday - 1
            const rotatEmbed = new botEmbed()
            .domainRotation(today)
            .setImage(rotationData[today].image)
            logch.send({embeds: [rotatEmbed]});
            console.log('aaaaa');
        },{
            timezone: "Asia/Jakarta"
        })

    }

}