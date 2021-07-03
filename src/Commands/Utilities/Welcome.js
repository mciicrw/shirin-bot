const Command = require('../../Structures/Command');
const fs = require('fs').promises;
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['w'],
			description: 'Change welcome message channel',
			usage: `${prefix}welcome <new channel>`,
			category: 'Utilities'
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		if (!message.member.hasPermission(['MANAGE_CHANNELS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');
		const newChannel = message.mentions.channels.first().id;
		if (!newChannel) return message.channel.send('You need to pass new channel in order to set welcome channel');
		async function updateChannel(newChan) {
			try {
				const data = await fs.readFile('config.json');
				const obj = JSON.parse(data);

				obj.welcome = newChan;

				await fs.writeFile('config.json', JSON.stringify(obj, null, 2));
			} catch (err) {
				console.log(err);
				message.channel.send('There was an error trying to change this bot prefix');
				throw err;
			}
		}
		updateChannel(newChannel);
		return message.channel.send(`Done! Welcome channel is now bound to ${message.mentions.channels.first()}`);

		// return console.log(newChannel);
	}

};
