const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			// aliases: ['catimg', 'catpics'],
			description: 'Mock your message!',
			usage: `${prefix}mock <text>`,
			category: 'Fun'
		});
	}

	async run(message, args) {
		const text = args.join(' ');
		const textEven = text.toLowerCase().split('');
		const textOdd = text.toLowerCase().split('');

		for (let i = 1 - 1; i <= textOdd.length - 1; i += 2) {
			textOdd[i] = textOdd[i].toUpperCase();
		}

		for (let i = 2 - 1; i <= textEven.length - 1; i += 2) {
			textEven[i] = textEven[i].toUpperCase();
		}

		const textArr = [`${textEven.join('')}`, `${textOdd.join('')}`];

		return message.author.lastMessage.delete().then(() => message.channel.send(textArr[Math.floor(Math.random() * textArr.length)]));
	}

};
