const Event = require('../../Structures/Event.js');
const BotEmbed = require('../../Structures/BotEmbed.js');

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot) return;
		const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
		const embed = new BotEmbed()
			.setColor(3066993)
			.setAuthor(message.author.tag, this.client.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Message Deleted')
			.setDescription([
				`**❯ Message ID:** ${message.id}`,
				`**❯ Channel:** ${message.channel}`,
				`**❯ Author:** ${message.member.displayName}`,
				`${attachments ? `**❯ Attachments:** ${attachments.join('\n')}` : ''}`
			]);
		if (message.content.length) {
			embed.splitFields(`**❯ Deleted Message:** ${message.content}`);
		}

		const channel = message.guild.channels.cache.find(ch => ch.name === 'test-bot-log');
		if (channel) channel.send(embed);
	}

};
