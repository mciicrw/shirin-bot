/* eslint-disable id-length */

const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { prefix } = require('../../../config.json');

module.exports = class MuteMember extends Command {

	constructor() {
		super({
            name: "mute",
            aliases: ["muted"],
            description: "Mute member from spamming in server",
            usage: "",
            category: "Moderation",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ['KICK_MEMBERS', 'ADMINISTRATOR'],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		// if (!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');
		const role = message.guild.roles.cache.find(ro => ro.name === 'Mute');
		if (!role) {
			return message.channel.send('No Mute role, please add one, and make sure premit them to send message and this role\'s position right below my highest role')
				.then(m => setTimeout(() => { m.delete(); }, 5000));
		}
		const muteMember = message.mentions.members.last() || message.guild.members.get(args[0]);
		if (!muteMember) return message.channel.send('You need to mention member to mute them!');

		if (!muteMember.manageable) return message.channel.send(`Cannot Mute ${muteMember}, maybe he has role higher than me`);

		const muted = muteMember.roles.cache.find(mu => mu.name === 'Mute');
		if (muted) return message.channel.send('This user has been muted! You can\'t mute them again!');

		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		const auditReason = `Muted because ${reason} | ${message.author.tag}`;

		const muteEmbed = new MessageEmbed()
			.setColor('PURPLE')
			.setAuthor(`${message.guild.name} Moderation Log`, message.guild.iconURL({ dynamic: true }))
			.addField(`Moderation Type: Mute`, `User: ${muteMember.user.tag}\nModerator: ${message.author.tag}`)
			.setFooter(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		try {
			const data = fs.readFileSync('config.json');
			const obj = JSON.parse(data);

			const { log } = obj;

			const botCh = message.guild.channels.cache.find(ch => ch.id === log);
			if (!botCh) return console.log('No welcome channel provided, please create one!');

			// const userLeave = member.user.tag;
			return muteMember.roles.add(role, auditReason).then(() => {
				message.channel.send(`${muteMember} You've been muted by ${message.author}, please contact staff if you want to be unmuted`);
				botCh.send({embeds: [muteEmbed]});
			});
		} catch (err) {
			this.client.logger.error(err,{tag: 'Commands'});
			throw err;
		}
	}

};
