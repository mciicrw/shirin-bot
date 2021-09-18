const genshin = require('genshin-db');
const { prefix } = require('../../../config.json');
const { element } = require('../../utils/ObjectCollection');

module.exports = class Ele extends Command {
    constructor() {
        super({
            name: "element",
            aliases: ["ele"],
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

        // await message.channel.sendTyping();
        // const charCons = genshin.constellations(args[0]);

        // const consteEmbed = new MessageEmbed()
        // .setTitle(`${charCons.name}'s Constellation`)
        // .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	    // .setTimestamp();

        // for(let c = 0; c < 6; c++){
        //     let cons = `c${c+1}`;
        //     consteEmbed.addField(`C${c+1} | ${charCons[cons].name}`,charCons[cons].effect,false);
        // }

        // return message.reply({embeds: [consteEmbed]});

        const elemenres = genshin.elements(args[0]);
        const elemoji = element[elemenres.name].emoji
        return message.reply(elemoji);   

    }
}