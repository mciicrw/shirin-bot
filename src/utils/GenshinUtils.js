const {MessageButton, MessageActionRow, MessageSelectMenu, Message} = require('discord.js');
const botEmbed = require('./EmbedBuilder');
const weapons = require('../assets/data/weapons');
const { prefix, devPrefix} = require('../../config.json');
const genshin = require('genshin-db');
const { sevenTalent } = require('../assets/data/ObjectCollection');

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
		const example = type === 'Character' ? 'build' : type.toLowerCase();
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

			const idk = message.author;
			let repl;
			if(idk) repl = await message.reply({embeds: [listEmbed], components: [row]});
			if(!idk) {
				await message.reply({embeds: [listEmbed], components: [row]});
				repl = await message.fetchReply();
			}
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
	 * @param {Message} message discordjs message event
     * @param {any} character character data from genshin-db
     * @param {array} data sorted character build data
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

	/**
	 * embed builder for genshin build, idk why this here
	 * @param {any} character character data from genshin-db
	 * @param {any} displayData selected build data
	 * @returns MessageEmbed
	 */
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

	/**
	 * genshin character details main function
	 * @param {Message} message discordjs message event
	 * @param {string} charname genshin character name
	 * @param {string} element string element type
	 * @returns Message
	 */
	async getCharDetails(message, charname, element) {
		let counter = 0;
		let selValue = 0;
		const charvar = charname === 'traveler' || charname === 'sora' ? 'aether' :
			charname === 'hotaru' ? 'lumine' : charname;
		const charother = charname === 'aether' || charname === 'lumine' ? 'traveler' : charname;
		if (charother === 'traveler' && !element) return message.reply('Please specify traveler\'s element!');
		const detailsArr = ['bio', 'ascend', 'constellation', 'talent'];
		const character = genshin.characters(charvar, {matchAliases:true});
		if(!character || Array.isArray(character)) return message.reply('Sorry I cannot find character data that you\'re looking for');
		const conste = charother === 'traveler' ?
			genshin.constellations(charother + ' ' + element, {matchAliases:true}) :
			genshin.constellations(charother);
		const talent = charother === 'traveler' ?
			genshin.talents(charother + ' ' + element, {matchAliases:true}) :
			genshin.talents(charother);
		const talentarr = this.getCharTalent(talent);
		const charaEmbed = new botEmbed()
			.charDetails(character);

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
		// const bRow = new MessageActionRow().addComponents([bPrev, bNext]);
		if (counter === 0) bPrev.setDisabled(true);
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

		const rpl = await message.reply({embeds: [charaEmbed], components: [row]});
		const collector = rpl.createMessageComponentCollector({
			componentType: 'SELECT_MENU',
			time: 5 * 60 * 1000
		});
		const buttonCollector = rpl.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 5 * 60 * 1000
		});

		collector?.on('collect', async inter => {
			if(inter.customId === 'charDetailSelect') {
				selValue = Number(inter.values[0].at(-1));
				const charaEmbed = new botEmbed()
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp();
				if(selValue === 0) charaEmbed.charDetails(character);
				if(selValue === 1) charaEmbed.charAscend(character);
				if(selValue === 2) charaEmbed.charConste(character, conste);
				if(selValue === 3) {
					charaEmbed.charTalent(character, talentarr[counter]);
					const bRow = new MessageActionRow().addComponents([bPrev, bNext]);
					const row = new MessageActionRow().addComponents(
						new MessageSelectMenu({
							customId: 'charDetailSelect',
							placeholder: 'Select to view other character details',
							options: detailsOpt
						})
					);
					return await inter.update({embeds: [charaEmbed], components: [bRow, row]});
				}
				const row = new MessageActionRow().addComponents(
					new MessageSelectMenu({
						customId: 'charDetailSelect',
						placeholder: 'Select to view other character details',
						options: detailsOpt
					})
				);
				return await inter.update({embeds:[charaEmbed], components: [row]});
			}
		});

		collector?.on('end', async inter => {
			const charaEmbed = new botEmbed()
				.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			if(selValue === 0) charaEmbed.charDetails(character);
			if(selValue === 1) charaEmbed.charAscend(character);
			if(selValue === 2) charaEmbed.charConste(character, conste);
			if(selValue === 3) charaEmbed.charTalent(character, talentarr[counter]);
			rpl.edit({
				embeds: [charaEmbed],
				components: [
					new MessageActionRow().addComponents(
						new MessageSelectMenu({
							customId: 'chardetails-stop',
							placeholder: 'Type command again to refresh',
							options: detailsOpt,
							disabled: true
						})
					)
				]
			});
		});

		buttonCollector?.on('collect', async ind => {
			if (ind.customId === 'list-prev') {
				counter -= 1;
				const charaEmbed = new botEmbed()
					.charTalent(character, talentarr[counter])
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp();
				bNext.setDisabled(false);
				if (counter === 0) bPrev.setDisabled(true);
				const bRow = new MessageActionRow().addComponents([bPrev, bNext]);
				const row = new MessageActionRow().addComponents(
					new MessageSelectMenu({
						customId: 'charDetailSelect',
						placeholder: 'Select to view other character details',
						options: detailsOpt
					})
				);
				return await ind.update({embeds: [charaEmbed], components: [bRow, row]});

			}
			if (ind.customId === 'list-next') {
				counter += 1;
				const charaEmbed = new botEmbed()
					.charTalent(character, talentarr[counter])
					.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp();
				bPrev.setDisabled(false);
				if (counter === talentarr.length - 1) bNext.setDisabled(true);
				const bRow = new MessageActionRow().addComponents([bPrev, bNext]);
				const row = new MessageActionRow().addComponents(
					new MessageSelectMenu({
						customId: 'charDetailSelect',
						placeholder: 'Select to view other character details',
						options: detailsOpt
					})
				);
				return await ind.update({embeds: [charaEmbed], components: [bRow, row]});
			}
		});

		// eslint-disable-next-line no-unused-vars
		buttonCollector?.on('end', async ind => {
			const charaEmbed = new botEmbed()
				.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
			if(selValue === 0) charaEmbed.charDetails(character);
			if(selValue === 1) charaEmbed.charAscend(character);
			if(selValue === 2) charaEmbed.charConste(character, conste);
			if(selValue === 3) charaEmbed.charTalent(character, talentarr[counter]);
			rpl.edit({
				embeds: [charaEmbed],
				components: [
					new MessageActionRow().addComponents(
						new MessageSelectMenu({
							customId: 'chardetails-stop',
							placeholder: 'Type command again to refresh',
							options: detailsOpt,
							disabled: true
						})
					)
				]
			});
		});

	}

	/**
	 * Genshin char talent count checker
	 * @param {any} talent talent object from genshin-db
	 * @returns Array
	 */
	getCharTalent(talent) {
		const charentries = Object.entries(talent);
		const charentriesslice = charentries.slice(1, -2);
		if(charentriesslice.length == 7) {
			const choosetalent = sevenTalent.filter(tType => tType.charlist.find(char => char === talent.name));
			return this.pussshh(talent, charentriesslice, choosetalent[0].type);
		}
		if(charentriesslice.length <= 6) {
			return this.pussshh(talent, charentriesslice, 'normal');
		}
		return undefined;
	}

	/**
	 * Genshin char talent array builder
	 * @param {any} chartalent talent object from genshin-db
	 * @param {array} talent combat and passive tallent array
	 * @param {string} type talent type, can be active or any string
	 * @returns Array
	 */
	pussshh(chartalent, talent, type) {
		const activeCount = type === 'active' ? 4 : 3;
		const talentarr = [];
		talent.forEach((el, ind) => {
			if(ind < activeCount) {
				const selectattrib = chartalent[el[0]];
				const talentattrib = selectattrib.attributes.labels;
				const attribObj = {
					type: el[0],
					name: selectattrib.name,
					info: selectattrib.info,
					attributes: [],
				};
				talentattrib.forEach((e) => {
					const regall = /((\{param[0-9]+)(:(F1P}|F2P}|F1}|F2}|P}|I})))/g;
					const momen = e.match(regall);
					if(momen.length == 1) {
						const paramarr = momen[0].slice(1, -1).split(':');
						const outtype = paramarr[1];
						const gettalentparam = selectattrib.attributes.parameters[paramarr[0]][0];
						let storage = '';
						if(outtype === 'F1P') storage = Math.floor(gettalentparam * 1000) / 10 + '%';
						if(outtype === 'F2P') storage = Math.floor(gettalentparam * 10000) / 100 + '%';
						if(outtype === 'F1') storage = `${Math.floor(gettalentparam)}`;
						if(outtype === 'F2') storage = `${gettalentparam}`;
						if(outtype === 'P') storage = Math.floor(gettalentparam * 100) + '%';
						if(outtype === 'I') storage = `${Math.floor(gettalentparam)}`;
						const rplc = e.replace(momen, storage);
						attribObj.attributes.push(rplc);
					}
					if(momen.length >= 2) {
						let paramstr = e;
						momen.forEach((el) => {
							const paramarr = el.slice(1, -1).split(':');
							const outtype = paramarr[1];
							const gettalentparam = selectattrib.attributes.parameters[paramarr[0]][0];
							let storage = '';
							if(outtype === 'F1P') storage = Math.floor(gettalentparam * 1000) / 10 + '%';
							if(outtype === 'F2P') storage = Math.floor(gettalentparam * 10000) / 100 + '%';
							if(outtype === 'F1') storage = `${Math.floor(gettalentparam)}`;
							if(outtype === 'F2') storage = `${gettalentparam}`;
							if(outtype === 'P') storage = Math.floor(gettalentparam * 100) + '%';
							if(outtype === 'I') storage = `${Math.floor(gettalentparam)}`;
							paramstr = paramstr.replace(el, storage);
						});
						attribObj.attributes.push(paramstr);
					}
				});
				talentarr.push(attribObj);
			}
			if(ind >= activeCount) {
				const tType = el[0];
				const tName = el[1].name;
				const tEffect = el[1].info;
				talentarr.push({
					type: tType,
					name: tName,
					effect: tEffect
				});
			}
		});
		return talentarr;
	}
};