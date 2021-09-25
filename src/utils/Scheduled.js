const cron = require('node-cron');
const discord = require('discord.js');
const config = require('../../config.json');
const { rotationData } = require('../assets/data/ObjectCollection');
const botEmbed = require('./EmbedBuilder');

module.exports = class Scheduled {

    dailyRotation(client){
        cron.schedule('* 3 * * *', () => {
            const logch = client.channels.cache.get(config.log)
            const today = new Date
            const attach = new discord.MessageAttachment(rotationData[today.getDay()].image)
            const rotatEmbed = new botEmbed()
                .domainRotation(today.getDay())
                .setImage(`attachment://${rotationData[today.getDay()].imgname[0]}`)
            logch.send({embeds: [rotatEmbed],files: [attach]});
            // console.log('aaaaa');
        },{
            timezone: "Asia/Jakarta"
        })

    }

}