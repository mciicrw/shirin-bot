const genshin = require('genshin-db');
const { builds } = require('../../assets/data/builds');
const { element } = require('../../assets/data/ObjectCollection');

const mcm = [
	'traveler', 'aether', 'sora'
];

const mcf = [
	'lumine', 'hotaru'
];

// eslint-disable-next-line no-undef
module.exports = class CharBuild extends Command {

	constructor() {
		super({
			name: 'build',
			aliases: ['cb'],
			description: 'Get Character List and Build Guide',
			usage: 'build [name]',
			category: 'Genshin',
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: []
		});
	}

	async exec(message, args) {
		// eslint-disable-next-line eqeqeq
		if (args.length == 0) {
			const charList = genshin.characters('names', { matchCategories: true });
			const listChunked = [];
			for (let i = 0; i < charList.length; i += 12) {
				const chunk = charList.slice(i, i + 12);
				listChunked.push(chunk);
			}
			return this.client.gutils.sendListEmbed(message, listChunked, 'Character');
		}
		if (mcm.some(value => args[0].includes(value))) {
			if (!args[1]) return message.reply('Please specify traveler\'s element!');
			const ele = args[1].toLowerCase();
			const char = genshin.characters('aether');
			const current = builds[`traveler_${ele}`];

			const sortedBuild = Object.entries(current.roles).sort((a, b) =>
				a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
			);

			const elecap = this.client.utils.capitalise(ele);
			const charData = {
				name: `Traveler ${elecap}`,
				icon: char.images.icon,
				eleColor: element[elecap].color
			};

			return await this.client.gutils.buildEmbed(message, charData, sortedBuild);
		}
		if (mcf.some(value => args[0].includes(value))) {
			if (!args[1]) return message.reply('Please specify traveler\'s element!');
			const ele = args[1].toLowerCase();
			const char = genshin.characters('lumine');
			const current = builds[`traveler_${ele}`];

			const sortedBuild = Object.entries(current.roles).sort((a, b) =>
				a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
			);

			const elecap = this.client.utils.capitalise(ele);
			const charData = {
				name: `Traveler ${elecap}`,
				icon: char.images.icon,
				eleColor: element[elecap].color
			};

			return await this.client.gutils.buildEmbed(message, charData, sortedBuild);
		}
		const name = args.join(' ');
		const char = genshin.characters(name.toLowerCase(), { matchAliases: true });
		if (!char || Array.isArray(char)) return message.reply(`Sorry i cant find character build that you're looking for`);
		// console.log()
		const current = builds[char.name.toLowerCase().replace(' ', '_')];

		if (!current) return message.reply('Sorry i cant find character build that you\'re looking for');

		const sortedBuild = Object.entries(current.roles).sort((a, b) =>
			a[1].recommended === b[1].recommended ? 0 : a[1].recommended ? -1 : 1
		);

		const charData = {
			name: char.name,
			icon: char.images.icon,
			eleColor: element[char.element].color
		};

		return await this.client.gutils.buildEmbed(message, charData, sortedBuild);
	}

};
