// const { Message } = require('discord.js');
const {checkConnection} = require('../../../db/dbconfig');

module.exports = class CheckConn extends Command {
	constructor() {
		super({
			name: "connection",
			aliases: ["conn", "cc"],
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
		const connn = await checkConnection();
		if(connn === true) return message.reply('connect ges');
		return message.reply('error ges');
	}
};