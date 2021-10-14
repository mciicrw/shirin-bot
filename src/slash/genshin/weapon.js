// const { Interaction } = require('discord.js');
const genshin = require('genshin-db');
const botEmbed = require('../../utils/EmbedBuilder');

module.exports = class SlashWp extends Interaction {
	constructor() {
		super({
			name: "weapon",
			description: "Get Weapon description and stats",
			options: [
				{type: 3, name: 'name', description: 'Weapon name you want to show information', required: false},
				{type: 5, name: 'max-stats', description: 'If true, will display weapon\'s max status', required: false}
			]
		});
	}

	async exec(interaction) {
		const wpstr = interaction.options.getString('name');
		const maxed = interaction.options.getBoolean('max-stats');
		if (!wpstr && !maxed) {
			const weaponList = genshin.weapons('names', {matchCategories:true});
			const listChunked = [];
			for(let i = 0; i < weaponList.length; i += 12) {
				const chunk = weaponList.slice(i, i += 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(interaction, listChunked, 'Weapon');
		}
		if(!wpstr && maxed) return interaction.reply({ephemeral:true, content:`Please specify weapon name!`});

		if(wpstr && maxed === true) {
			const weapon = genshin.weapons(wpstr, {matchAliases:true});
			if(!weapon || Array.isArray(weapon)) return interaction.reply({ephemeral:true, content:`Sorry i cant find weapons that you're looking for`});
			const stat90 = weapon.stats(90);

			const baseatk = Math.floor(stat90.attack).toString();
			let sub = '';
			let refine = '';
			if (weapon.rarity >= 3) {
				sub = weapon.substat === 'Elemental Mastery' ?
					`${Math.trunc(stat90.specialized)}` : `${Math.floor(stat90.specialized * 1000) / 10}%`;
				refine = weapon.effect;
				for(let i = 0; i < weapon.effect.match(/{.}/g).length; i++) {
					refine = refine.replace(`{${i}}`, `**${weapon.r5[i]}**`);
				}
			}

			const wpEmbed = new botEmbed()
				.setThumbnail(weapon.images.awakenicon)
				.setColor(interaction.guild.me.displayHexColor)
				.weaponEmbed(weapon, baseatk, sub, refine)
				.shirinFooter(interaction);

			return interaction.reply({embeds: [wpEmbed]});
		}
		const weapon = genshin.weapons(wpstr, {matchAliases: true});
		if(!weapon || Array.isArray(weapon)) return interaction.reply({ephemeral:true, content:`Sorry i cant find weapons that you're looking for`});

		const baseatk = weapon.baseatk.toString();
		let sub = '';
		let refine = '';
		if(weapon.rarity >= 3) {
			sub = weapon.substat === 'Elemental Mastery' ? `${weapon.subvalue}` : `${weapon.subvalue}%`;
			refine = weapon.effect;
			for(let i = 0; i < weapon.effect.match(/{.}/g).length; i++) {
				refine = refine.replace(`{${i}}`, `**${weapon.r1[i]}**`);
			}
		}

		const wpEmbed = new botEmbed()
			.setThumbnail(weapon.images.icon)
			.setColor(interaction.guild.me.displayHexColor)
			.weaponEmbed(weapon, baseatk, sub, refine)
			.shirinFooter(interaction);

		return interaction.reply({embeds: [wpEmbed]});
	}
};