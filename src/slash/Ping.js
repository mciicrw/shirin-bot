const { MessageEmbed } = require('discord.js');

module.exports = class SlashPing extends Interaction {
    constructor() {
        super({
            name: "ping",
            description: "Ping command",
        });
    }
    async exec(interaction) {
        const msg = interaction.reply('pinging')

        const latency = msg.createdTimestamp - interaction.createdTimestamp;
		const pingEmbed = new MessageEmbed()
			.setColor(4568450)
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Heartbeat', value: `${Math.round(this.client.ws.ping)} ms` },
				{ name: 'Roundtrip', value: `${latency} ms` }
			);

        return interaction.editReply({ ephemeral: true, embeds: [pingEmbed]})
    }
}