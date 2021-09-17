const genshin = require('genshin-db');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = class Conste extends Command {
    constructor() {
        super({
            name: "constellation",
            aliases: ["cons","conste"],
            description: "Get Character constellation",
            usage: "cons <character name>",
            category: "Genshin",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }
    async exec(message, args) {
        if (args.length == 0) return message.reply('Please add character to check constellation')
        .then(m => setTimeout(() => {m.delete()}, 3000));

        await message.channel.sendTyping();
        const charCons = genshin.constellations(args[0]);

        const consteEmbed = new MessageEmbed()
        .setTitle(`${charCons.name}'s Constellation`)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	    .setTimestamp();

        for(let c = 0; c < 6; c++){
            let cons = `c${c+1}`;
            consteEmbed.addField(`C${c+1} | ${charCons[cons].name}`,charCons[cons].effect,false);
        }

        return message.reply({embeds: [consteEmbed]});

    }
}