const {MessageButton, MessageActionRow, MessageSelectMenu} = require('discord.js');
const botEmbed = require('./EmbedBuilder');
const weapons = require('../assets/data/weapons');
const { prefix, devPrefix} = require('../../config.json');
const genshin = require('genshin-db');

const prf = process.env.DEPLOY === 'DEV' ? devPrefix : prefix;

module.exports = class GenshinUtils {

	/**
     * send list embed
     * @param {any} message discord message event
     * @param {array} list genshin array list
     * @param {string} type list type string
     */
	async sendListEmbed(message, list, type) {
		let listIndex = 0;
		const example = type === 'Character' ? 'build' : type.toLowerCase;
		if(list.length > 1) {
			const listEmbed = new botEmbed()
				.setColor(message.guild.me.displayHexColor)
				.genshinList(list[listIndex], type);

			const bPrev =
                new MessageButton({
                	customId: 'list-prev',
                	label: 'Prev',
                	style: 'SECONDARY'
                });
			const bNext =
                new MessageButton({
                	customId: 'list-next',
                	label: 'Next',
                	style: 'SECONDARY'
                });

			if (listIndex === 0) bPrev.setDisabled(true);

			const row = new MessageActionRow().addComponents([bPrev, bNext]);

			const repl = await message.reply({embeds: [listEmbed], components: [row]});

			const collector = repl.createMessageComponentCollector({
				componentType: 'BUTTON',
				time: 5 * 60 * 1000
			});

			collector?.on('collect', async ind => {
				if (ind.customId === 'list-prev') {
					listIndex -= 1;
					const listEmbed = new botEmbed()
						.setColor(message.guild.me.displayHexColor)
						.genshinList(list[listIndex], type);
					bNext.setDisabled(false);
					if (listIndex === 0) bPrev.setDisabled(true);
					const row = new MessageActionRow().addComponents([bPrev, bNext]);
					await ind.update({embeds: [listEmbed], components: [row]});
				}
				if (ind.customId === 'list-next') {
					listIndex += 1;
					const listEmbed = new botEmbed()
						.setColor(message.guild.me.displayHexColor)
						.genshinList(list[listIndex], type);
					bPrev.setDisabled(false);
					if (listIndex === list.length - 1) bNext.setDisabled(true);
					const row = new MessageActionRow().addComponents([bPrev, bNext]);
					await ind.update({embeds: [listEmbed], components: [row]});
				}
			});

			// eslint-disable-next-line no-unused-vars
			collector?.on('end', async ind => {
				const listEmbed = new botEmbed()
					.setColor(message.guild.me.displayHexColor)
					.genshinList(list[listIndex], type);

				repl.edit({
					embeds: [listEmbed],
					components: [
						new MessageActionRow().addComponents(
							new MessageButton({
								customId: 'list-stop',
								label: `type ${prf}${example} again to refresh`,
								style: 'SECONDARY',
								disabled: true,
							})
						)
					]
				});
			});
		}
		else {
			const listEmbed = new botEmbed()
				.setColor(message.guild.me.displayHexColor)
				.genshinList(list, type);

			return message.reply({embeds: [listEmbed]});
		}
	}

	/**
     * genshin build recommendation embed
     * @param {any} character character data from genshin-db
     * @param {any} data sorted character build data
     */
	async buildEmbed(message, character, data) {
		let index = 0;
		const buildEmbed = this.getBuildData(character, data[index]);
		buildEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		if(data.length == 1) return message.reply({embeds:[buildEmbed]});

		const buttons = data.map((builds, dindex) => {
			return new MessageButton({
				customId: `characterbuild-${dindex}`,
				label: builds[0],
				style: 'PRIMARY'
			});
		});

		buttons.forEach((button, dindex) => {
			button.disabled = dindex === index;
		});

		const row = new MessageActionRow().addComponents(...buttons);
		const msg = await message.reply({embeds: [buildEmbed], components: [row]});
		const collector = msg.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 5 * 60 * 1000
		});

		collector?.on('collect', async inter => {
			if(inter.customId.startsWith('characterbuild-')) {
				index = Number(inter.customId.substring('characterbuild-'.length));
				const buildEmbed = this.getBuildData(character, data[index]);
				buttons.forEach((button, dindex) => {
					button.disabled = dindex === index;
				});
				const row = new MessageActionRow().addComponents(...buttons);
				await inter.update({
					embeds: [buildEmbed],
					components: [row]
				});
			}
		});

		// eslint-disable-next-line no-unused-vars
		collector?.on('end', async inter => {
			const buildEmbed = this.getBuildData(character, data[index]);
			buildEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			msg.edit({
				embeds: [buildEmbed],
				components: [
					new MessageActionRow().addComponents(
						new MessageButton({
							customId: 'characterbuild-stop',
							label: `type ${prf}build ${character.name} again to refresh`,
							style: 'SECONDARY',
							disabled: true
						})
					)
				]
			});
		});
	}

	getBuildData(character, displayData) {
		const name = displayData[0];
		const build = displayData[1];
		const weapon = build.weapons.map((weapon, dindex) => {
			const refine = !weapon.refine ?
				'' : weapon.refine.length > 1 ?
					`**R${weapon.refine[0]}-${weapon.refine[1]}**` : `**R${weapon.refine[0]}**`;
			const stack = weapon.stack ? `**S${weapon.stack}**` : '';
			return `**${dindex + 1}.** ${weapons[weapon.id].name} ${refine} ${stack}`;
		}).join('\n');

		const arteMain = [
			`**Sands:** ${build.mainStats.sands}`,
			`**Goblet:** ${build.mainStats.goblet}`,
			`**Circlet:** ${build.mainStats.circlet}`
		].join('\n');

		const arteList = build.artifacts.map((arte, dindex) => {
			if(arte.length > 2) return `**${dindex + 1}. Choose 2:** ` + arte.map(a => `${a} (2)`).join(' / ');
			if(arte.length > 1) return `**${dindex + 1}.** ${arte[0]} (2) ${arte[1]} (2)`;
			return `**${dindex + 1}.** ${arte[0]} (4)`;
		}).join('\n');

		const arteSub = build.subStats.map((sub, dindex) => {
			return `**${dindex + 1}.** ${sub}`;
		}).join('\n');

		const talent = build.talent.map((talent, dindex) => {
			return `**${dindex + 1}.** ${talent}`;
		}).join('\n');


		const buildEmbed = new botEmbed()
			.setAuthor(`${character.name} | ${name} build`, character.icon)
			.setColor(character.eleColor)
			.setDescription(build.note)
			.addFields([
				{name: 'Artifacts', value: arteList, inline: true},
				{name: 'Main Stats', value: arteMain, inline:true},
				{name: 'Sub Stats', value: arteSub, inline:true},
				{name: 'Weapon', value: weapon, inline: true},
				{name: 'Talent Priority', value: talent, inline: true},
			]);


		if(build.tip) buildEmbed.addField('Ability Tips', build.tip, false);

		return buildEmbed;
	}

	async getCharDetails(message, charname) {
		const detailsArr = ['bio', 'ascend', 'talent', 'constellation'];
		const character = genshin.characters(charname, {matchAliases:true});
		const charaEmbed = new botEmbed()
			.charDetails(character);
		const detailsOpt = [];
		for(let i = 0; i < 4; i++) {
			detailsOpt.push({
				label: `Character ${detailsArr[i]}`,
				description: `Display character ${detailsArr[i]}`,
				value: `dtls_${i}`
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu({
				customId: 'charDetailSelect',
				placeholder: 'Select to view other character details',
				options: detailsOpt
			})
		);

		return message.reply({embeds: [charaEmbed], components: [row]});

	}
};