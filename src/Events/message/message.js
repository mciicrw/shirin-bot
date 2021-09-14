const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);
		// console.log(mentionRegexPrefix);
		// console.log(mentionRegex);

		if (!message.guild || message.author.bot) return;

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
			// console.log(prefix);

		const msgprefix = message.content.split('');
		if (msgprefix[0] === prefix || message.content.match(mentionRegexPrefix)) {
			// eslint-disable-next-line no-unused-vars
			const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

			const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
			if (command) {
				command.run(message, args);
				console.log(`${message.author.tag} run ${command.name} command`);
			}
		}
		return;
	}

};
