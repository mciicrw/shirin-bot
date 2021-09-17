module.exports = class SlashPing extends Interaction {
    constructor() {
        super({
            name: "ping",
            description: "Ping command",
        });
    }
    async exec(interaction) {

        const latency = msg.createdTimestamp - message.createdTimestamp;
		const pingEmbed = new Discord.MessageEmbed()
			.setColor(4568450)
			.setTitle(':ping_pong: Pong!')
			.addFields(
				{ name: 'Heartbeat', value: `${Math.round(this.client.ws.ping)} ms` },
				{ name: 'Roundtrip', value: `${latency} ms` }
			);

        return interaction.reply({ ephemeral: true, embeds: [pingEmbed]})
    }
}