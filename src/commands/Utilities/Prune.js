
const { prefix } = require('../../../config.json');

module.exports = class PruneMsg extends Command {

	constructor() {
		super({
            name: "prune",
            aliases: ["clear", "delmsg"],
            description: "Clear up to 99 messages",
            usage: "",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
            clientPerms: [],
        });
	}

	async exec(message, args) {
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
			this.client.logger.error(err, {tag: 'Commands'});
			message.channel.send('There was an error trying to prune messages in this channel');
		});
	}

};
