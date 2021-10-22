const genshin = require('genshin-db');
//const botEmbed = require('../../utils/EmbedBuilder');
const {chunksize} = require('../../../config.json');
//const { arteDomain, raritymoji } = require('../../assets/data/ObjectCollection');


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

		return this.client.gutils.artifactHelper(interaction, arteDetails);
	}
};