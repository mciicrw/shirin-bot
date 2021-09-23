const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
const config = require('../../../config.json');
const { raritymoji } = require('../../assets/data/ObjectCollection');

module.exports = class CharBuild extends Command {
    constructor(){
        super({
            name: "weapon",
            aliases: ["wp"],
            description: "Get Weapon List and Details",
            usage: "build [name]",
            category: "Genshin",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }

    async exec(message,args) {
        const prf = process.env.DEPLOY === "DEV" ? config.devPrefix : config.prefix;
        const name = args.join(' ')
        if (!name || name.length == 0) {
            const helperEmbed = new botEmbed()
                .setTitle('Weapon Command')
                .setDescription([
                    "It seems you don't input any argument here",
                    "Here i display how to use this command",
                    "I don't use embed pagination because don't know how"
                ].join('\n'))
                .setColor(message.guild.me.displayHexColor)
                .addFields([
                    {
                        name: "Weapon Listing by raity or single alphabet character",
                        value: `\`\`\`ml\n${prf}weapon <1>\n\`\`\``
                    },
                    {
                        name: "Weapon Description",
                        value: `\`\`\`ml\n${prf}weapon <name>\n\`\`\``
                    }
                ])
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

                return message.reply({embeds: [helperEmbed]})
        }
        if (name.length == 1) { 
            const weapon = genshin.weapons(name,{matchCategories:true});
            if (!weapon ) return message.reply(`Invalid weapon rarity!`);

            console.log(weapon)
            const listEmbed = new botEmbed()
                .setColor(message.guild.me.displayHexColor)
                .genshinList( weapon, 'Weapon')
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	            .setTimestamp();

            return message.reply({embeds: [listEmbed]});
        }

        const weapon = genshin.weapons(name,{matchAliases: true});
        if(!weapon || Array.isArray(weapon)) return message.reply(`Sorry i cant find weapons that you're looking for`)

        const sub = weapon.substat === "Elemental Mastery" ? weapon.subvalue : `${weapon.subvalue}%`

        if (weapon.rarity <= 2) { const wpEmbed = new botEmbed()
            .setTitle(weapon.name)
            .setThumbnail(weapon.images.icon)
            .setDescription([weapon.description, raritymoji[weapon.rarity - 1]].join('\n'))
            .setColor(message.guild.me.displayHexColor)
            .addFields([
                {name: "Weapon Type", value: weapon.weapontype, inline:true},
                {name: "Ascension Material Type", value: weapon.weaponmaterialtype ? weapon.weaponmaterialtype : 'Unknown', inline:true},
                {name: "Base ATK", value: weapon.baseatk.toString(), inline:true}
            ])
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	        .setTimestamp();

            return message.reply({embeds: [wpEmbed]});
        }

        let refine = weapon.effect
        for( let i = 0; i < weapon.effect.match(/{.}/g).length; i++) {
            refine = refine.replace(`{${i}}`, `**${weapon.r1[i]}**`);
        }

        const wpEmbed = new botEmbed()
            .setTitle(weapon.name)
            .setThumbnail(weapon.images.icon)
            .setDescription([weapon.description, raritymoji[weapon.rarity - 1]].join('\n'))
            .setColor(message.guild.me.displayHexColor)
            .addFields([
                {name: "Weapon Type", value: weapon.weapontype, inline:true},
                {name: "Ascension Material Type", value: weapon.weaponmaterialtype ? weapon.weaponmaterialtype : 'Unknown', inline:true},
                {name: '\u200b', value: '\u200b', inline:false},
                {name: "Base ATK", value: weapon.baseatk.toString(), inline:true},
                {name: weapon.substat, value: sub, inline:true},
                {name: weapon.effectname, value: refine, inline:false}
            ])
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
	        .setTimestamp();

        return message.reply({embeds: [wpEmbed]});
    }
}