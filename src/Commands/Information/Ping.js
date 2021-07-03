const Command = require('../../Structures/Command.js');
const Discord = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Pong! now with embed!',
			category: 'information',
			usage: `${prefix}ping`
		});
	}

	async run(message) {
		const msg = await message.channel.send('Pinging...');

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const pingEmbed = new Discord.MessageEmbed()
			.setColor(4568450)
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Heartbeat', value: `${Math.round(this.client.ws.ping)} ms` },
				{ name: 'Roundtrip', value: `${latency} ms` }
			);

		msg.edit(pingEmbed);
	}

};
