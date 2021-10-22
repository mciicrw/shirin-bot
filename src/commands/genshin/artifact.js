const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
// const { arteDomain, raritymoji } = require('../../assets/data/ObjectCollection');

module.exports = class Arte extends Command {
	constructor() {
		super({
			name: "artifact",
			aliases: ["arte", "arti"],
			description: "Get Artifact List and Details",
			usage: "artifact [name]",
			category: "Genshin",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}

	async exec(message, args) {
		if (args.length == 0) {
			const arteList = genshin.artifacts('names', {matchCategories: true});
			const listChunked = [];
			for(let i = 0; i < arteList.length; i += 12) {
				const chunk = arteList.slice(i, i + 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(message, listChunked, 'Artifact');
		}

		const arteDetails = genshin.artifacts(args.join(' '), {matchAliases:true, matchCategories:true});
		if (!arteDetails || Array.isArray(arteDetails)) return message.reply(`Sorry i cant find artifacts that you're looking for`);

		return this.client.gutils.artifactHelper(message,arteDetails);
	}
};