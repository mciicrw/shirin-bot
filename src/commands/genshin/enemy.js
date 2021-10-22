/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');

const enemyType =['dummy', 'COMMON', 'ELITE', 'BOSS'];

module.exports = class GenshinEnemies extends Command {

	constructor() {
		super({
			name: 'enemy',
			aliases: ['mob', 'monster'],
			description: 'Get Enemy List and Details',
			usage: 'emeny [name]',
			category: 'Genshin',
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: []
		});
	}

	async exec(message, args) {

		if (args.length == 0) {
			const enemyList = genshin.enemies('names', { matchCategories: true });
			const listChunked = [];
			for (let i = 0; i < enemyList.length; i += 12) {
				const chunk = enemyList.slice(i, i + 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(message, listChunked, 'Enemie');
		}

		const enemyDetails = genshin.enemies(args.join(' '), {matchAliases:true});
		if(!enemyDetails || Array.isArray(enemyDetails)) return message.reply(`Sorry, i can't find enemy that you're looking for`);

		const enemyRarity = enemyType.indexOf(enemyDetails.type);

		const enemyEmbed = new botEmbed()
			.genshinEnemyEmbed(enemyDetails, enemyRarity)
			.shirinFooter(message);


		return message.reply({embeds:[enemyEmbed]});
	}

};
