const Command = require('../../Structures/Command.js');
const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../../package.json');
const { utc } = require('moment');
const os = require('os');
const ms = require('ms');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bot'],
			description: 'Display bot info and details',
			category: 'Information',
			usage: `${prefix}bot`
		});
	}

	run(message) {
		const core = os.cpus()[0];
		const botEmbed = new MessageEmbed()
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
			.setColor(message.guild.me.displayHexColor || 3066993)
			.setTitle(`:robot: | ${this.client.user.username}'s info`)
			.addField(':wrench: | General', [
				`**~❯ Client:** ${this.client.user.tag} (${this.client.user.id})`,
				`**~❯ Commands:** ${this.client.commands.size}`,
				`**~❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()}`,
				`**~❯ User:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`**~❯ Channel:** ${this.client.channels.cache.size.toLocaleString()}`,
				`**~❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
				`**~❯ Node.js Version:** ${process.version}`,
				`**~❯ Bot Version:** v${version}`,
				`**~❯ Discord.js Version:** ${djsversion}`,
				'\u200b'
			])
			.addField(':satellite_orbital: | SysInfo', [
				`**~❯ Platform:** ${process.platform}`,
				`**~❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
				`**~❯ CPU:**`,
				`\u3000 Cores: ${os.cpus().length}`,
				`\u3000 Model: ${core.model}`,
				`\u3000 Speed: ${core.speed}MHz`,
				`**~❯ Memory:**`,
				`\u3000 Total: ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
				`\u3000 Used: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}`
			])
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send(botEmbed);
	}

};

