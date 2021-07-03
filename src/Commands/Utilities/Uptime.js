const Command = require('../../Structures/Command.js');
const ms = require('ms');

module.exports = class extends Command {

	async run(message) {
		message.channel.send(`My Uptime is \`${ms(this.client.uptime, { long: true })}\``);
	}

};
