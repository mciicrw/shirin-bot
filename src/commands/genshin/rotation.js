const { MessageSelectMenu, MessageActionRow } = require('discord.js');
const botEmbed = require('../../utils/EmbedBuilder');
const { rotationData } = require('../../assets/data/ObjectCollection');
const { DateTime } = require('luxon');

module.exports = class domainRt extends Command {
	constructor() {
		super({
			name: "domainrt",
			aliases: ["rotation", "today", "daily"],
			description: "Today's domain rotation",
			usage: "cons <character name>",
			category: "Genshin",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}

	async exec(message, args) {
		let uhh = 0;
		const today = DateTime.now().setZone('Asia/Jakarta').weekday - 1;
		const rotatEmbed = new botEmbed()
			.domainRotation(today)
			.setImage(rotationData[today].image);
		const rotOpt = [];
		for(let i = 0; i < 7; i++) {
			rotOpt.push({
				label: rotationData[i].day,
				description: `Get ${rotationData[i].day} rotation data`,
				value: `opt_${i}`
			});
		}
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu({
				customId: 'rotationSelect',
				placeholder: 'Select to view other day rotation',
				options: rotOpt
			})
		);

		const msg = await message.reply({embeds: [rotatEmbed], components: [row]});

		const collector = msg.createMessageComponentCollector({
			componentType: 'SELECT_MENU',
			time: 5 * 60 * 1000
		});

		collector?.on('collect', async inter => {
			if(inter.customId === 'rotationSelect') {
				uhh = Number(inter.values[0].at(-1));
				const rotatEmbed = new botEmbed()
					.domainRotation(uhh)
					.setImage(rotationData[uhh].image);
				const row = new MessageActionRow().addComponents(
					new MessageSelectMenu({
						customId: 'rotationSelect',
						placeholder: 'Select to view other day rotation',
						options: rotOpt
					})
				);
				inter.update({embeds:[rotatEmbed], components:[row]});
			}
		});

		collector?.on('end', async inter => {
			const rotatEmbed = new botEmbed()
				.domainRotation(uhh)
				.setImage(rotationData[uhh].image);
			msg.edit({
				embeds: [rotatEmbed],
				components: [
					new MessageActionRow().addComponents(
						new MessageSelectMenu({
							customId: 'rotation-stop',
							placeholder: 'type command again to refresh',
							options: rotOpt,
							disabled: true
						})
					)
				]
			});
		});
	}
};