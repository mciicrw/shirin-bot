const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
const { arteDomain, raritymoji } = require('../../assets/data/ObjectCollection');

module.exports = class Arte extends Command {
    constructor() {
        super({
            name: "artifact",
            aliases: ["arte","arti"],
            description: "Get Artifact List and Details",
            usage: "artifact [name]",
            category: "Genshin",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }

    async exec(message, args){
        if (args.length == 0) {
            const arteListFarm = genshin.artifacts('4',{matchCategories: true});
            const arteListFod = genshin.artifacts('2',{matchCategories: true});
            // const arteList = arteListFarm.concat(arteListFod);
            const arteList = genshin.artifacts('names',{matchCategories: true})

            const listEmbed = new botEmbed()
                .setColor(message.guild.me.displayHexColor)
                .genshinList(arteList,'Artifact')
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            return message.reply({embeds: [listEmbed]})
        }

        const arteDetails = genshin.artifacts(args.join(' '), {matchAliases:true, matchCategories:true});
        if (!arteDetails || Array.isArray(arteDetails)) return message.reply(`Sorry i cant find artifacts that you're looking for`)

        const arteSource = arteDomain.filter( domain => domain.list.find(arte => arte === arteDetails.name))

        if(arteDetails.name.includes('Prayers')) {
            const arteEmbed = new botEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(arteDetails.name)
            .setThumbnail(arteDetails.images.circlet)
            .setDescription(raritymoji[arteDetails.rarity[arteDetails.rarity.length - 1] - 1])
            .addFields([
                {name:"1 Set Effect", value: arteDetails['1pc'], inline:true},
                {name:"Location", value: arteSource[0].name, inline:false}
            ])
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.reply({embeds:[arteEmbed]})
        }

        const arteEmbed = new botEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(arteDetails.name)
            .setThumbnail(arteDetails.images.flower)
            .setDescription(raritymoji[arteDetails.rarity[arteDetails.rarity.length - 1] - 1])
            .addFields([
                {name:"2 Set Effect", value: arteDetails['2pc'], inline:true},
                {name:"4 Set Effect", value: arteDetails['4pc'], inline:true},
                {name:"Location", value: arteSource[0].name, inline:false}
                
            ])
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        return message.reply({embeds:[arteEmbed]})

    }
}