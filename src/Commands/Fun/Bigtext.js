const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

const numberEmoji = [
	':zero:', ':one:', ':two:',
	':three:', ':four:', ':five:',
	':six:', ':nine:', ':eight:',
	':nine:'
];


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			// aliases: ['catimg', 'catpics'],
			description: 'Generate message you send with regional indicator',
			usage: `${prefix}bigtext <text>`,
			category: 'Fun'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		const text = args.join(' ');
		const textArr = text.toLowerCase().split('');
		const regexStr = RegExp(/([a-z])/gi);
		const regexDig = RegExp(/([0-9])/gi);
		let strBig = '';
		textArr.forEach(str => {
			if (str === ' ') {
				strBig += ' ';
			} else if (str.match(regexStr)) {
				strBig += `:regional_indicator_${str}:`;
			} else if (str.match(regexDig)) {
				strBig += `${numberEmoji[str]}`;
			} else if (str === '!') {
				strBig += ':exclamation:';
			} else {
				strBig += ':question:';
			}
		});
		return message.author.lastMessage.delete().then(() => {
			message.channel.send(strBig);
		});
	}

};
