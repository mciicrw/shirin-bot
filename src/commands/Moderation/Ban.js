/* eslint-disable id-length */

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { prefix } = require('../../../config.json');

module.exports = class Banish extends Command {

	constructor() {
		super({
            name: "ban",
            aliases: ["banish","pb"],
            description: "Permanently ban user from server",
            usage: "",
            category: "Moderation",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ["BAN_MEMBERS", "ADMINISTRATOR"],
            clientPerms: [],
        });
	}

	// eslint-disable-next-line no-unused-vars
	async exec(message, args) {
		// if (!message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');

		const banMember = message.mentions.members.last() || message.guild.members.get(args[0]);
		const banUser = banMember.user;
		if (!banMember) return message.channel.send('You need to mention user to ban them!');

		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		const auditReason = `${reason} | ${message.author.tag}`;

		if (!banMember.bannable) return message.channel.send(`Cannot ban ${banMember.user.tag}, maybe he has role higher than this bot`);

		const banEmbed = new MessageEmbed()
			.setColor('RED')
			.setAuthor(`${message.guild.name} Moderation Log`, message.guiild.iconURL({ dynamic: true }))
			.addField(`Moderation Type: PermaBan`, `User: ${banUser.tag}\nModerator: ${message.author.tag}\nReason: ${reason}`)
			.setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		try {
			const data = fs.readFileSync('config.json');
			const obj = JSON.parse(data);

			const { log } = obj;

			const botCh = message.guild.channels.cache.find(ch => ch.id === log);
			if (!botCh) return console.log('No welcome channel provided, please create one!');

			// const userLeave = member.user.tag;
			return banUser.send(`you have been banned from **${message.guild.name}** because \`${reason}\``).then(() => {
				message.channel.send(`${banMember.user.tag} has been banned from this server because \`${reason}\``).then(m => setTimeout(() => { m.delete(); }, 3000));
			}).then(() => {
				botCh.send({embeds:[banEmbed]});
				return banMember.ban({ reason: auditReason });
			});
		} catch (err) {
			this.client.logger.error(err,{tag: 'Commands'});
			throw err;
		}
	}

};
