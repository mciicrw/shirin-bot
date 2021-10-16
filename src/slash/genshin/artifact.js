const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
const {chunksize} = require('../../../config.json');
const { arteDomain, raritymoji } = require('../../assets/data/ObjectCollection');


module.exports = class SlashArtifact extends Interaction {
	constructor() {
		super({
			name: "artifact",
			description: "Get artifact list and details",
			options: [
				{type: 3, name: 'name', description: 'Character name you want to show build guide', required: false}
			]
		});
	}

	async exec(interaction) {
		const artestr = interaction.options.getString('name');
		if(!artestr) {
			const artelist = genshin.artifacts('names', {matchCategories:true});
			const listChunked = [];
			for(let i = 0; i < artelist.length; i += chunksize) {
				const chunk = artelist.slice(i, i + chunksize);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(interaction, listChunked, 'Artifact');
		}

		const arteDetails = genshin.artifacts(artestr, {matchAliases:true});
		if(!arteDetails || Array.isArray(arteDetails)) return interaction.reply({ephemeral:true, content:`Sorry i cant find artifacts that you're looking for`});

		const arteSource = arteDomain.filter(domain => domain.list.find(arte => arte === arteDetails.name));

		if (arteDetails.name.includes('Prayers')) {
			const arteEmbed = new botEmbed()
				.setColor(interaction.guild.me.displayHexColor)
				.setTitle(arteDetails.name)
				.setThumbnail(arteDetails.images.circlet)
				.setDescription(raritymoji[arteDetails.rarity[arteDetails.rarity.length - 1] - 1])
				.addFields([
					{name:'1 Set Effect', value: arteDetails['1pc'], inline:true},
					{name:'Location', value: arteSource[0].name, inline:false}
				])
				.shirinFooter(interaction);
			return interaction.reply({embeds:[arteEmbed]});
		}

		const arteEmbed = new botEmbed()
			.setColor(interaction.guild.me.displayHexColor)
			.setTitle(arteDetails.name)
			.setThumbnail(arteDetails.images.flower)
			.setDescription(raritymoji[arteDetails.rarity[arteDetails.rarity.length - 1] - 1])
			.addFields([
				{name:'2 Set Effect', value: arteDetails['2pc'], inline:true},
				{name:'4 Set Effect', value: arteDetails['4pc'], inline:true},
				{name:'Location', value: arteSource[0].name, inline:false}
			])
			.shirinFooter(interaction);
		return interaction.reply({embeds:[arteEmbed]});
	}
};