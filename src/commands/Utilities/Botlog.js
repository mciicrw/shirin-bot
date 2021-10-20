const fs = require('fs').promises;
const { prefix } = require('../../../config.json');


module.exports = class BotLog extends Command {

	constructor() {
		super({
			name: "botlog",
			aliases: ["logging"],
			description: "Change bot log channel",
			usage: "",
			category: "Utilities",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
			clientPerms: [],
		});
	}

	// eslint-disable-next-line no-unused-vars
	async exec(message, args) {
		// if (!message.member.hasPermission(['MANAGE_CHANNELS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');
		const newChannel = message.mentions.channels.first().id;
		if (!newChannel) return message.channel.send('You need to pass new channel in order to set welcome channel');
		async function updateChannel(newChan) {
			try {
				const data = await fs.readFile('config.json');
				const obj = JSON.parse(data);

				obj.log = newChan;

				await fs.writeFile('config.json', JSON.stringify(obj, null, 2));
			}
			catch (err) {
				this.client.logger.error(err, {tag: 'Commands'});
				message.channel.send('There was an error trying to change this bot log channel');
				throw err;
			}
		}
		updateChannel(newChannel);
		return message.channel.send(`Done! Welcome channel is now bound to ${message.mentions.channels.first()}`);

		// return console.log(newChannel);
	}

};
