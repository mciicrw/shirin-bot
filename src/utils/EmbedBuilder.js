const { MessageEmbed } = require('discord.js');
// const genshin = require('genshin-db');
const emobjects = require('../assets/data/ObjectCollection');


// module.exports =
module.exports = class botEmbed extends MessageEmbed {
	/**
     * Genshin character details embed
     * @param {Object.<string, any>} character character object
     * @returns MessageEmbed
     */
	addGenshinHeader(character) {
		const charDetails = character; // genshin.character(character);

		this.color = !emobjects.element[charDetails.element] ? '#e9d6aa' : emobjects.element[charDetails.element].color;
		this.title = charDetails.title === '' ? `${charDetails.name} | Traveler` : `${charDetails.name} | ${charDetails.title}`;
		this.url = charDetails.url.fandom;
		this.thumbnail = {url: charDetails.images.icon};
		if(emobjects.element[charDetails.element]) {
			this.description = [
				`${emobjects.element[charDetails.element].emoji} | ${emobjects.rarity[charDetails.rarity - 1].emoji}`,
				charDetails.description
			].join('\n');
		}
		this.description = [
			emobjects.rarity[charDetails.rarity - 1].emoji,
			charDetails.description
		].join('\n');

		return this;
	}

	/**
     * Domain Rotation embed for genshin
     * @param {number} dow date of week
     * @returns MessageEmbed
     */
	domainRotation(dow) {
		this.color = '#FFAA00';
		if (dow === 6) {
			// const attachment = new MessageAttachment('../../img/sunday.png','img.png');
			this.title = "Today's Rotation | Sunday";
			this.fields = [
				{
					name: 'Everything',
					value: 'Every talent and ascension material opened today\nYou can farm any domain that you need',
					inline: false
				}
			];
			return this;
		}
		this.title = `Today's Rotation | ${emobjects.rotationData[dow].day}`;
		this.fields = [
			{
				name: 'Talent Materials',
				value: emobjects.rotationData[dow].talent,
				inline: true
			},
			{
				name: 'Ascension Materials',
				value: emobjects.rotationData[dow].mats,
				inline: true
			}
		];
		return this;
	}

	/**
     * List embed for genshin
     * @param {Array.<string>} listarr list array from genshin-db search result
     * @param {string} type list type, can be weapon, character, or artifact
     * @returns MessageEmbed
     */
	genshinList(listarr, type) {
		this.title = `${type}s List`;
		this.description = `Below are list of ${type.toLowerCase()}s that currently available`;
		this.fields = [
			{
				name: '\u200b',
				value: `\`\`\`fix\n${listarr.join('\n')}\`\`\``,
				inline: false
			}
		];

		return this;
	}

	/**
     * Embed builder for genshin weapon command
     * @param {Object.<string, any>} weapon weapon object from genshin-db
     * @param {string} baseatk calculated weapon baseatk
     * @param {string} sub calculated weapon substat
     * @param {string} refine formatted refinement string
     * @returns MessageEmbed
     */
	weaponEmbed(weapon, baseatk, sub, refine) {
		this.color = emobjects.rarity[weapon.rarity - 1 ].color;
		if (weapon.rarity <= 2) {
			this.title = weapon.name;
			this.description = [
				weapon.description,
				emobjects.rarity[weapon.rarity - 1].emoji
			].join('\n');
			this.fields = [
				{name: "Weapon Type", value: weapon.weapontype, inline:true},
				{name: "Ascension Material Type", value: weapon.weaponmaterialtype ? weapon.weaponmaterialtype : 'Unknown', inline:true},
				{name: "Base ATK", value: weapon.baseatk.toString(), inline:true}
			];

			return this;
		}

		this.title = weapon.name;
		this.description = [
			weapon.description,
			emobjects.rarity[weapon.rarity - 1].emoji
		].join('\n');
		this.fields = [
			{name: "Weapon Type", value: weapon.weapontype, inline:true},
			{name: "Ascension Material Type", value: weapon.weaponmaterialtype ? weapon.weaponmaterialtype : 'Unknown', inline:true},
			{name: '\u200b', value: '\u200b', inline:false},
			{name: "Base ATK", value: baseatk, inline:true},
			{name: weapon.substat, value: sub, inline:true},
			{name: weapon.effectname, value: refine, inline:false}
		];

		return this;
	}

	/**
	 * Character constellation embed builder
	 * @param {Object.<string, any>} character character data collected from genshin-db
	 * @param {Array.<string,any>} conste consteallaction array collected from genshin-db
	 * @returns MessageEmbed
	 */
	charConste(character, conste) {
		this.addGenshinHeader(character);
		for(let c = 0; c < 6; c++) {
			const cons = `c${c + 1}`;
			this.addField(`C${c + 1} | ${conste[cons].name}`, conste[cons].effect, false);
		}
		return this;
	}

	/**
	 * Character ascension embed builder
	 * @param {Object.<string, any>} character character data collected from genshin-db
	 * @returns MessageEmbed
	 */
	charAscend(character) {
		this.addGenshinHeader(character);
		const ascendEntries = Object.entries(character.costs);
		ascendEntries.forEach((ascend, aIndex) => {
			const ascendCostStr = ascend[1].map(entries => {
				return `**${entries.name}:** ${entries.count}`;
			}).join('\n');
			this.addField(`Ascend ${aIndex + 1}`, ascendCostStr, true);
		});
		return this;
	}

	/**
	 * Character details embed builder
	 * @param {Object.<string, any>} character character data collected from genshin-db
	 * @returns MessageEmbed
	 */
	charDetails(character) {
		this.addGenshinHeader(character);
		this.fields = [
			{
				name: 'Details',
				value: [
					`**Gender:** ${character.gender}`,
					`**Weapon:** ${character.weapontype}`,
					`**Birthday:** ${character.birthday || 'Player\'s birthday'}`,
					`**Region:** ${character.region || 'None'} / ${character.affiliation || 'None'}`,
					`**Constellation:** ${character.constellation}`
				].join('\n'),
				inline: false
			},
			{
				name: 'VA',
				value: [
					`**English:** ${character.cv.english}`,
					`**Chinese:** ${character.cv.chinese}`,
					`**Japanese:** ${character.cv.japanese}`,
					`**Korean:** ${character.cv.korean}`
				].join('\n'),
				inline: false
			}
		];
		this.image = {url: character.images.cover1};
		if(character.name === 'Lumine' || character.name === 'Aether') this.image = {url:character.images.portrait};
		return this;
	}

	/**
	 * Genshin character talent embed
	 * @param {Object.<string, any>} character genshin-db character object
	 * @param {Object.<string, any>} talent genshin-db talent object
	 * @returns Message Embed object
	 */
	charTalent(character, talent) {
		const type = talent.type.slice(0, -1);
		this.addGenshinHeader(character);
		if(type === 'combat' || type === 'combats') {
			const attrb = talent.attributes.map(el => {
				const splitd = el.split('|');
				return `**${splitd[0]}**: ${splitd[1]}`;
			});
			this.fields = [
				{name: talent.name, value: talent.info, inline: false},
				{name: 'Attributes', value: attrb.join('\n'), inline:false}
			];
		}
		if(type === 'passive') {
			this.fields = [
				{name: talent.name, value: talent.effect, inline: false}
			];
		}
		return this;
	}

	/**
	 * Genshin Artifact embed builder
	 * @param {string} type artifact type, flower, plume, sands etc.
	 * @param {Object.<string,string>} details artifact details built as an object
	 * @param {Object.<string,string>} piece piece details object, retrieved from genshin-db
	 * @param {Object.<string,string>} image image list object form genshin-db
	 * @returns Message Embed
	 */
	artefactEmbed(type, details, piece, image) {
		this.color = emobjects.rarity[details.rarity[details.rarity.length - 1] - 1].color
		this.title = `${details.name} | ${piece.name}`;
		this.description = [
			piece.description,
			emobjects.rarity[details.rarity[details.rarity.length - 1] - 1].emoji
		].join('\n');
		if (details.name.includes('Prayers')) {
			this.fields = [
				{name:'1 Set Effect', value: details['1pc'], inline:true},
			];
		}
		else {
			this.fields = [
				{name:'2 Set Effect', value: details['2pc'], inline:true},
				{name:'4 Set Effect', value: details['4pc'], inline:true}
			];
		}
		this.addField('Location', details.source, false);
		this.thumbnail = { url:image[type]};
		return this;
	}

	genshinEnemyEmbed(){

	}

	splitFields(contentOrTitle, rawContent) {
		if (typeof contentOrTitle === 'undefined') return this;

		let title;
		let content;
		if (typeof rawContent === 'undefined') {
			title = ZWS;
			content = contentOrTitle;
		}
		else {
			title = contentOrTitle;
			content = rawContent;
		}

		if (Array.isArray(content)) content = content.join('\n');
		if (title === ZWS && !this.description && content.length < 2048) {
			this.description = content;
			return this;
		}

		// eslint-disable-next-line id-length
		let x;
		let slice;
		while (content.length) {
			if (content.length < 1024) {
				this.fields.push({ name: title, value: content, inline: false });
				return this;
			}

			slice = content.slice(0, 1024);
			x = slice.lastIndexOf('\n');
			if (x === -1) slice.lastIndexOf('');
			if (x === -1) x = 1024;

			this.fields.push({ name: title, value: content.trim().slice(0, x), inline: false });
			content = content.slice(x + 1);
			title = ZWS;
		}
		return this;
	}

	/**
	 * FOOOOOOTER
	 * @param {dObject.<string, any>} message discordjs message event
	 * @returns discordjs message embed
	 */
	shirinFooter(message) {
		this.footer = message.author ?
			{text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true })} : {text: `Requested by ${message.user.username}`, iconURL: message.user.displayAvatarURL({ dynamic: true })};
		this.setTimestamp();

		return this;
	}
};

// "```fix\nAmber,Bennett,Diluc,Hu Tao,Klee,Xiangling,Xinyan,Yanfei,Yoimiya```"