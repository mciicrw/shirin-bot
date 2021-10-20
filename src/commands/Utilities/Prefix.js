const fs = require('fs').promises;
const { prefix } = require('../../../config.json');
require('dotenv/config');
const MDiscord = require('../../models/guild');


module.exports = class BotPrefix extends Command {
	constructor() {
		super({
			name: "prefix",
			aliases: ["chp", "pref"],
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
		const isGuild = await MDiscord.findOne({where:{discord_id:message.guild.id}});
		if(!isGuild) {
			await MDiscord.create({discord_id:message.guild.id, prefix:newPrefix});
			const guildData = MDiscord.findOne({where:{discord_id:message.guild.id},raw:true});
			this.client.database.guilds.set(message.guild.id, guildData);
		}
		if(isGuild) {
			await MDiscord.update({prefix:newPrefix}, {where:{discord_id:message.guild.id}});
			const guildData = MDiscord.findOne({where:{discord_id:message.guild.id},raw:true});
			this.client.database.guilds.set(message.guild.id, guildData);
		}
		return message.channel.send(`Done! This bot's prefix is now ${newPrefix}`);
	}

};
