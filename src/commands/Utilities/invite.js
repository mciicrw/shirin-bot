const { MessageEmbed } = require('discord.js');

module.exports = class inpit extends Command {
    constructor() {
        super({
            name: "invite",
            aliases: ["inv"],
            description: "Invite me!",
            usage: "invite",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }

    async exec(message,args){
        const inviEmbed = new MessageEmbed()
        .setColor('#ffe5c4')
        .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
        .setTitle('Thanks for Inviting Paimin!')
        .setDescription('You can invite Paimin using [this link](https://tinyurl.com/paimin-invite)')

        return message.reply({embeds: [inviEmbed]})
    }
}