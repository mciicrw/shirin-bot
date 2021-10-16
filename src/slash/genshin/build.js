const genshin = require('genshin-db');
const { builds } = require('../../assets/data/builds');
const { element } = require('../../assets/data/ObjectCollection');
const {chunksize} = require('../../../config.json');

const mcm = [
	'traveler', 'aether', 'sora'
];

const mcf = [
	'lumine', 'hotaru'
];

module.exports = class SlashCharBuild extends Interaction {
	constructor() {
		super({
			name: "build",
			description: "Get character list and build guide",
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
			const charList = elestr ?
				genshin.characters(elestr, {matchCategories:true}) : genshin.characters('names', {matchCategories:true});
			if(!charList || Array.isArray(charList) === false) return interaction.reply({ephemeral:true, content:`Unknown element! i can't categorize based on this element`});
			const listChunked = [];
			for(let i = 0; i < charList.length; i += chunksize) {
				const chunk = charList.slice(i, i + chunksize);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(interaction, listChunked, 'Character');
		}
		if(mcm.some(value => charstr.includes(value))) {
			if(!elestr) return interaction.reply({ephemeral: true, content:`Please specify traveler's element!`});
			const elelow = elestr.toLowerCase();
			const char = genshin.characters('aether');
			const current = builds[`traveler_${elelow}`];

			const sortedBuild = Object.entries(current.roles).sort((a, b) =>
				a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
			);

			const elecap = this.client.utils.capitalise(elelow);
			const charData = {
				name: `Traveler ${elecap}`,
				icon: char.images.icon,
				eleColor: element[elecap].color
			};

			return await this.client.gutils.buildEmbed(interaction, charData, sortedBuild);
		}
		if(mcf.some(value => charstr.includes(value))) {
			if(!elestr) return interaction.reply({ephemeral: true, content:`Please specify traveler's element!`});
			const elelow = elestr.toLowerCase();
			const char = genshin.characters('lumine');
			const current = builds[`traveler_${elelow}`];

			const sortedBuild = Object.entries(current.roles).sort((a, b) =>
				a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
			);

			const elecap = this.client.utils.capitalise(elelow);
			const charData = {
				name: `Traveler ${elecap}`,
				icon: char.images.icon,
				eleColor: element[elecap].color
			};

			return await this.client.gutils.buildEmbed(interaction, charData, sortedBuild);
		}
		const char = genshin.characters(charstr.toLowerCase(), {matchAliases:true});
		if(!char || Array.isArray(char)) return interaction.reply({ephemeral:true, content:`Sorry i cant find character build that you're looking for`});

		const current = builds[char.name.toLowerCase().replace(' ', '_')];
		if(!current) return interaction.reply({ephemeral:true, content:`Sorry i cant find character build that you're looking for`});

		const sortedBuild = Object.entries(current.roles).sort((a, b) =>
			a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
		);

		const charData = {
			name: char.name,
			icon: char.images.icon,
			eleColor: element[char.element].color
		};

		return await this.client.gutils.buildEmbed(interaction, charData, sortedBuild);
	}
};