const { Client, Collection } = require('discord.js');
const Util = require('./Util.js');

module.exports = class MenuDocsClient extends Client {

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

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be an Object');

		if (!options.token) throw new Error('You must pass the token for the client!');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass the prefix for the client!');
		if (typeof options.prefix !== 'string') throw new Error('Prefix should be a type of String');
		this.prefix = options.prefix;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		// this.utils.loadDatabase();
		super.login(token);
	}

};
