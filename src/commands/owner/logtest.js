const MDiscord = require('../../models/guild');

module.exports = class LogTest extends Command {
	constructor() {
		super({
			name: "logtest",
			aliases: ["log", "logch"],
			description: "Get Artifact List and Details",
			usage: "artifact [name]",
			category: "Genshin",
			ownerOnly: true,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}

	async exec(message, args) {
		if (args.length === 0) {
			return message.reply('please specify channelID or channel mention');
		}
		const mod_log_channel = message.mentions.channels.first().id;
		const discord_id = message.guild.id;

		const isData = await MDiscord.findOne({where:{
			discord_id: discord_id
		}});
		if(isData) {
			await MDiscord.update({mod_log_channel}, {
				where:{
					discord_id: discord_id
				}
			});
			return message.reply('data updated!');
		}

		await MDiscord.create({discord_id, mod_log_channel});

		return message.reply('data created!');
	}
};