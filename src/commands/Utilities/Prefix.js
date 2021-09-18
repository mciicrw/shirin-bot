const fs = require('fs').promises;
const { prefix } = require('../../../config.json');
require('dotenv/config');


module.exports = class BotPrefix extends Command {
	constructor() {
		super({
            name: "prefix",
            aliases: ["chp","pref"],
            description: "Change bot prefix",
            usage: "",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ["MANAGE_GUILD", "ADMINISTRATOR"],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const newPrefix = args[0];
		if (!newPrefix) return message.channel.send('You need to pass new prefix in order to change it');
		if (newPrefix.length >= 5) return message.channel.send('Sorry but your prefix must be under 5 character!');
		this.client.prefix = newPrefix;
		async function updatePrefix(newPref) {
			try {
				if (process.env.DEPLOY === 'DEV') {
					const data = await fs.readFile('config.json');
					const obj = JSON.parse(data);

					obj.devPrefix = newPref;

					await fs.writeFile('config.json', JSON.stringify(obj, null, 2));
				} else {
					const data = await fs.readFile('config.json');
					const obj = JSON.parse(data);

					obj.prefix = newPref;

					await fs.writeFile('config.json', JSON.stringify(obj, null, 2));
				}
			} catch (err) {
				this.client.logger.error(err,{tag: 'Commands'});
				message.channel.send('There was an error trying to change this bot prefix');
				throw err;
			}
		}
		updatePrefix(newPrefix);
		return message.channel.send(`Done! This bot's prefix is now ${this.client.prefix}`);
	}

};
