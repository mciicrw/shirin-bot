const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['clear', 'delmsg'],
			description: 'Clear up to 99 message',
			usage: `${prefix}prune <number of message>`,
			category: 'Utilities'
		});
	}

	async run(message, args) {
		const amount = parseInt(args[0]) + 1;

		// eslint-disable-next-line new-cap
		if (isNaN(amount)) {
			// eslint-disable-next-line id-length
			return message.reply('Please input valid number.').then(m => {
				setTimeout(() => { m.delete(); }, 3000);
			});
		}

		if (amount <= 1 || amount > 100) {
			// eslint-disable-next-line id-length
			return message.reply('You need to input a number between 1 and 99').then(m => {
				setTimeout(() => { m.delete(); }, 3000);
			});
		}

		return await message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to prune messages in this channel');
		});
	}

};
