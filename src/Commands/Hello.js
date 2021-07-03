const Command = require('../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['hi', 'halo'],
			descripton: 'Just hello!'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		message.channel.send('hello! ');
		console.log(message.guild.channels.cache);
	}

};
