const { MessageEmbed } = require('discord.js');

module.exports = class SlashPing extends Interaction {
	constructor() {
		super({
			name: "ping",
			description: "Ping command",
		});
	}
	async exec(interaction) {
		const msg = await interaction.channel.send('pinging');

		const latency = msg.createdTimestamp - interaction.createdTimestamp;
		const pingEmbed = new MessageEmbed()
			.setColor(4568450)
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Heartbeat', value: `${Math.round(this.client.ws.ping)} ms & ${latency}` }
			);

		return interaction.reply({ ephemeral: true, embeds: [pingEmbed]});
	}
};