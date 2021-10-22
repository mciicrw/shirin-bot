const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');
// const config = require('../../../config.json');
// const { raritymoji } = require('../../assets/data/ObjectCollection');

module.exports = class CharBuild extends Command {
	constructor() {
		super({
			name: "weapon",
			aliases: ["wp"],
			description: "Get Weapon List and Details",
			usage: "build [name]",
			category: "Genshin",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}

	async exec(message, args) {
		// const prf = process.env.DEPLOY === "DEV" ? config.devPrefix : config.prefix;
		const name = args.join(' ');
		if (!name || name.length == 0) {
			const weaponList = genshin.weapons('names', {matchCategories:true});
			const listChunked = [];
			for(let i = 0; i < weaponList.length; i += 12) {
				const chunk = weaponList.slice(i, i + 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(message, listChunked, 'Weapon');
		}

		if (name.endsWith(' -m')) {
			const maxName = name.slice(0, -3);
			const weapon = genshin.weapons(maxName, {matchAliases:true});
			if(!weapon || Array.isArray(weapon)) return message.reply(`Sorry i cant find weapons that you're looking for`);
			const stat90 = genshin.weapons(maxName, {matchAliases:true}).stats(90);

			const baseatk = Math.floor(stat90.attack).toString();
			let sub = '';
			let refine = '';

			if (weapon.rarity >= 3) {
				sub = weapon.substat === "Elemental Mastery" ?
					`${Math.trunc(stat90.specialized)}` : `${Math.floor(stat90.specialized * 1000) / 10}%`;
				refine = weapon.effect;
				for(let i = 0; i < weapon.effect.match(/{.}/g).length; i++) {
					refine = refine.replace(`{${i}}`, `**${weapon.r5[i]}**`);
				}
			}

			const wpEmbed = new botEmbed()
				.setThumbnail(weapon.images.awakenicon)
				.weaponEmbed(weapon, baseatk, sub, refine)
				.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.reply({embeds: [wpEmbed]});
		}

		const weapon = genshin.weapons(name, {matchAliases: true});
		if(!weapon || Array.isArray(weapon)) return message.reply(`Sorry i cant find weapons that you're looking for`);

		const baseatk = weapon.baseatk.toString();
		let sub = '';
		let refine = '';
		if (weapon.rarity >= 3) {
			sub = weapon.substat === "Elemental Mastery" ? `${weapon.subvalue}` : `${weapon.subvalue}%`;
			refine = weapon.effect;
			for(let i = 0; i < weapon.effect.match(/{.}/g).length; i++) {
				refine = refine.replace(`{${i}}`, `**${weapon.r1[i]}**`);
			}
		}

		const wpEmbed = new botEmbed()
			.setThumbnail(weapon.images.icon)
			.weaponEmbed(weapon, baseatk, sub, refine)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return message.reply({embeds: [wpEmbed]});
	}
};