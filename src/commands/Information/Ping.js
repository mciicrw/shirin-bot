
const Discord = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = class Ping extends Command {

	constructor() {
		super({
            name: "ping",
            aliases: ["pong"],
            description: "Ping command",
            usage: "",
            category: "Information",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message) {
		const msg = await message.channel.send('Pinging...');

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const pingEmbed = new Discord.MessageEmbed()
			.setColor(4568450)
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Heartbeat', value: `${Math.round(this.client.ws.ping)} ms` },
				{ name: 'Roundtrip', value: `${latency} ms` }
			);

		return message.channel.send({embeds: [pingEmbed]});
	}

};
