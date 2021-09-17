/* eslint-disable id-length */

const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');

const numberEmoji = [
	'1️⃣', '2️⃣',
	'3️⃣', '4️⃣', '5️⃣',
	'6️⃣', '7️⃣', '8️⃣',
	'9️⃣', '🔟'
];
// 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟

module.exports = class Polling extends Command {

	constructor() {
		super({
            name: "poll",
            aliases: [],
            description: "Create Simple poll for your aaaaaaa",
            usage: "",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const str = args.join(' ');
		const argsArr = str.split(', ');
		if (!str) return message.channel.send('No args detected, aborting');
		// if (argsArr.length > 0 && argsArr.length < 2) return message.channel.send('Please Add due date');
		if (argsArr.length < 3) return message.channel.send('You need to pass at least 2 choice!');
		if (argsArr.length > 10) return message.channel.send('Too much choice, i can only handle 10 choice at once!');
		const desc = argsArr[0];
		// const due = argsArr[1];
		argsArr.splice(0, 1);
		const resArr = [];
		const pollEmbed = new MessageEmbed()
			.setColor(message.guild.me.displayColor)
			.setAuthor(`${desc}`, `${message.guild.iconURL({ dynamic: true })}`)
			.setFooter(`Requested by ${message.author.username}`)
			.setTimestamp();

		for (let i = 0; i < argsArr.length; i++) {
			resArr.push(`${numberEmoji[i]}. ${argsArr[i]}`);
		}
		pollEmbed.setDescription(resArr.join('\n'));
		// pollEmbed.addField('Due date', `${due}`);
		return message.channel.send({embeds: [pollEmbed]}).then(m => {
			for (let j = 0; j < argsArr.length; j++) {
				m.react(`${numberEmoji[j]}`);
			}
			// argsArr.forEach(choice => m.react(`${numberEmoji[choice]}`));
		});
	}

};
