const { Client, Collection } = require('discord.js');
const Util = require('./Util.js');
// const MPrefix = require('../Models/Prefix');
require('dotenv/config');


module.exports = class BotClient extends Client {


	constructor(options = {}) {
		super({
			disableMentions: 'everyone'
		});
		this.validate(options);

		this.commands = new Collection();

		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);

		this.owners = options.owners;
		/*
		this.on('message', async (message) => {
			const mentionRegex = RegExp(`^<@!${this.user.id}>$`);
			const mentionRegexPrefix = RegExp(`^<@!${this.user.id}> `);

			if (!message.guild || message.author.bot) return;

			if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.prefix}\`.`);

			const prefix = message.content.match(mentionRegexPrefix) ?
				message.content.match(mentionRegexPrefix)[0] : this.prefix;

			// eslint-disable-next-line no-unused-vars
			const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

			const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
			if (command) {
				command.run(message, args);
			}
		}); */
	}
/*
	async getPref() {
		const dbpref = await MPrefix.findOne({
			where: {
				guildId: guildid
			}
		});
		return dbpref;
	}
	*/
	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be an Object');

		// if (!options.token) throw new Error('You must pass the token for the client!');
		// this.token = options.token;
		// eslint-disable-next-line no-process-env
		// this.token = process.env.PROD_TOKEN;
		this.token = process.env.DEPLOY === 'DEV' ? process.env.DEV_TOKEN : process.env.PROD_TOKEN;

		if (!options.prefix) throw new Error('You must pass the prefix for the client!');
		if (typeof options.prefix !== 'string') throw new Error('Prefix should be a type of String');
		// const serverPrev = this.getPref();
		this.prefix = process.env.DEPLOY === 'DEV' ? options.devPrefix : options.prefix;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		// this.utils.checkDB();
		super.login(token);
	}

};
