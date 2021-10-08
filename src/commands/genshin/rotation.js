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
				const dow = Number(inter.values[0].at(-1));
				const rotatEmbed = new botEmbed()
					.domainRotation(dow)
					.setImage(rotationData[dow].image);
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
			msg.edit({
				content:'test',
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