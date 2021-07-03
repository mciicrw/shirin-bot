/* eslint-disable id-length */
const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			// aliases: ['permab'],
			description: 'Kick mentioned user out of server',
			usage: `${prefix}kick <user>`,
			category: 'Moderation'
		});
	}

	async run(message, args) {
		if (!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');

		const kickMember = message.mentions.members.last() || message.guild.members.get(args[0]);
		if (!kickMember) return message.channel.send('You need to mention user to kick them!');
		const kickUser = kickMember.user;

		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		const auditReason = `${reason} | ${message.author.tag}`;

		if (!kickMember.kickable) return message.channel.send(`Cannot kick ${kickMember.user.tag}, maybe he has role higher than this bot`);

		const kickEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor(`${message.guild.name} Moderation Log`, message.guild.iconURL({ dynamic: true }))
			.addField(`Moderation Type: Kick`, `User: ${kickUser.tag}\nModerator: ${message.author.tag}\nReason: ${reason}`)
			.setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();


		try {
			const data = fs.readFileSync('config.json');
			const obj = JSON.parse(data);

			const { log } = obj;

			const botCh = message.guild.channels.cache.find(ch => ch.id === log);
			if (!botCh) return console.log('No welcome channel provided, please create one!');

			// const userLeave = member.user.tag;
			return kickUser.send(`you have been Kicked from **${message.guild.name}** because \`${reason}\``).then(() => {
				message.channel.send(`${kickMember.user.tag} has been banned from this server because \`${reason}\``).then(m => setTimeout(() => { m.delete(); }, 3000));
			}).then(() => {
				botCh.send(kickEmbed);
				return kickMember.kick(auditReason);
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

};
