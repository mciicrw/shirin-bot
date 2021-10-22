const { Collection } = require("discord.js");

module.exports = class messageCreate extends Event {
	constructor() {
		super({
			name: "messageCreate",
			once: false,
		});
	}
	async exec(message) {
		const mentionRegPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot || !message.guild) return;

		const data = {};
		if (message.guild) data.guild = await this.client.findGuild({guildID: message.guild.id});
		const prefix = message.content.match(mentionRegPrefix) ? message.content.match(mentionRegPrefix)[0] : data.guild?.prefix;

		if(!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (command) {

			if(message.guild) {
				const memberCheck = command.memberPerms;
				if (memberCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberCheck);
					if(missing.length) {
						await message.channel.sendTyping();
						return message.reply(`You are missing \`${missing.join(', ')}\` permission.`);
					}
				}
				const clientCheck = command.clientPerms;
				if(clientCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientCheck);
					if(missing.length) {
						await message.channel.sendTyping();
						return message.reply(`I am missing \`${missing.join(', ')}\` permission.`);
					}
				}
			}

			if (command.ownerOnly && !this.client.owners.includes(message.author.id)) return;
			if(!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamp = this.client.cooldowns.get(command.name);
			const cdAmount = command.cooldown;
			if (timestamp.has(message.author.id)) {
				const expirationTime = timestamp.get(message.author.id) + cdAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(`> You need to wait ${timeLeft.toFixed(1)} more seconds!`);
				}
			}
			timestamp.set(message.author.id, now);
			setTimeout(() => timestamp.delete(message.author.id), cdAmount);
			try {
				command.exec(message, args);
			}
			catch (err) {
				this.client.logger.error(`An error occured: ${err.message}`, { tag: 'Message' });
				return message.reply(`> Sorry but an error occured.`);
			}
		}

	}
};