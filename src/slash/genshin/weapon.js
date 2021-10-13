// const { Interaction } = require('discord.js');
const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');

module.exports = class SlashWp extends Interaction {
	constructor() {
		super({
			name: "weapon",
			description: "Ping command",
			options: [
				{type: 3, name: 'name', description: 'Weapon name you want to show information', required: false}
			]
		});
	}

	async exec(interaction) {
		const wpstr = interaction.options.getString('name');
		if (!wpstr) {
			const weaponList = genshin.weapons('names', {matchCategories:true});
			const listChunked = [];
			for(let i = 0; i < weaponList.length; i += 12) {
				const chunk = weaponList.slice(i, i += 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(interaction, listChunked, 'Weapon');
		}
		return interaction.reply('it works!');
	}
};