const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');

// eslint-disable-next-line no-undef
module.exports = class GenshinChar extends Command {

	constructor() {
		super({
			name: 'character',
			aliases: ['char'],
			description: 'Get Character List and Details',
			usage: 'char [name]',
			category: 'Genshin',
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: []
		});
	}

	async exec(message, args) {
		// eslint-disable-next-line eqeqeq
		if (args.length == 0) {
			const charList = genshin.characters('names', { matchCategories: true });
			const listChunked = [];
			for (let i = 0; i < charList.length; i += 12) {
				const chunk = charList.slice(i, i + 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(message, listChunked, 'Character');
		}
		// const character = genshin.characters(args[0], {matchAliases:true});
		// const charEmbed = new botEmbed()
		// 	.charDetails(character);
		// return message.reply({embeds:[charEmbed]});
		return this.client.gutils.getCharDetails(message, args[0].toLowerCase());
	}

};
