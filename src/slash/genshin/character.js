const genshin = require('genshin-db');
const {chunksize} = require('../../../config.json');

module.exports = class SlashCharacter extends Interaction {
	constructor() {
		super({
			name: "character",
			description: "Get Character details",
			options: [
				{type: 3, name: 'name', description: 'Character name you want to show build guide', required: false},
				{type: 3, name: 'element', description: 'Traveler\'s element, not used in other character', required: false}
			]
		});
	}

	async exec(interaction) {
		const charstr = interaction.options.getString('name');
		const elestr = interaction.options.getString('element');
		if(!charstr) {
			const charlist = elestr ?
				genshin.characters(elestr, {matchCategories:true}) : genshin.characters('names', {matchCategories:true});
			if(!charlist || Array.isArray(charlist) === false) return interaction.reply({ephemeral:true, content: `Unknown category! i can't categorize based on this keyword`});
			const listChunked = [];
			for(let i = 0; i < charlist.length; i += chunksize) {
				const chunk = charlist.slice(i, i + chunksize);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(interaction, listChunked, 'Character');
		}
		if(charstr && elestr) return this.client.gutils.getCharDetails(interaction, charstr.toLowerCase(), this.client.utils.capitalise(elestr));
		return this.client.gutils.getCharDetails(interaction, charstr.toLowerCase());
	}
};