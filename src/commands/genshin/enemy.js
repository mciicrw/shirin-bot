/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const genshin = require('genshin-db');

module.exports = class GenshinEnemies extends Command {

	constructor() {
		super({
			name: 'enemy',
			aliases: ['mob', 'boss'],
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
		return message.reply('it works!');
	}

};
