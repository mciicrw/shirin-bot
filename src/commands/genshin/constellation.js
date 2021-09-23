const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
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
        if (args.length == 0) {
            const charList = genshin.characters('names',{matchCategories: true});

            const listEmbed = new botEmbed()
                .setColor(message.guild.me.displayHexColor)
                .genshinList(charList,'Character')
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            return message.reply({embeds: [listEmbed]})
        }

        await message.channel.sendTyping();
        const charCons = genshin.constellations(args[0]);
        
        const consteEmbed = new botEmbed()
        .addGenshinDetails(args[0])
        .addField(`Constellation`,'\u200b')
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	    .setTimestamp();

        for(let c = 0; c < 6; c++){
            let cons = `c${c+1}`;
            consteEmbed.addField(`C${c+1} | ${charCons[cons].name}`,charCons[cons].effect,false);
        }

        return message.reply({embeds: [consteEmbed]});

    }
}