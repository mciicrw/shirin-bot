const { MessageAttachment } = require('discord.js');
const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
const { rotationData } = require('../../utils/ObjectCollection');

module.exports = class domainRt extends Command {
    constructor() {
        super({
            name: "domainrt",
            aliases: ["rotation","today"],
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
        const today = new Date
        const attach = new MessageAttachment(rotationData[today.getDay()].image)
        const rotatEmbed = new botEmbed()
        .domainRotation(today.getDay())
        .setImage(`attachment://${rotationData[today.getDay()].imgname[0]}`)
        message.reply({embeds: [rotatEmbed],files: [attach]});
    }
}