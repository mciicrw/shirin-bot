const { MessageAttachment } = require('discord.js');
const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
const { rotationData } = require('../../assets/data/ObjectCollection');
const { DateTime } = require('luxon');

module.exports = class domainRt extends Command {
    constructor() {
        super({
            name: "domainrt",
            aliases: ["rotation","today", "daily"],
            description: "Today's domain rotation",
            usage: "cons <character name>",
            category: "Genshin",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }
    
    async exec(message,args) {
        const today = DateTime.now().setZone('Asia/Jakarta').weekday - 1
        const attach = new MessageAttachment(rotationData[today].image)
        const rotatEmbed = new botEmbed()
        .domainRotation(today)
        .setImage(`attachment://${rotationData[today].imgname[0]}`)
        message.reply({embeds: [rotatEmbed],files: [attach]});
    }
}