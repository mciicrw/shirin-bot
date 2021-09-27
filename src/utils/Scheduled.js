const cron = require('node-cron');
const discord = require('discord.js');
const config = require('../../config.json');
const { rotationData } = require('../assets/data/ObjectCollection');
const botEmbed = require('./EmbedBuilder');
const { DateTime } = require('luxon');

module.exports = class Scheduled {

    dailyRotation(client){
        cron.schedule('0 3 * * *', () => {
            const logch = client.channels.cache.get(config.log)
            const today = DateTime.now().setZone('Asia/Jakarta').weekday - 1
            const attach = new discord.MessageAttachment(rotationData[today.getDay()].image)
            const rotatEmbed = new botEmbed()
                .domainRotation(today)
                .setImage(`attachment://${rotationData[today].imgname[0]}`)
            logch.send({embeds: [rotatEmbed],files: [attach]});
            // console.log('aaaaa');
        },{
            timezone: "Asia/Jakarta"
        })

    }

}