
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../../config.json');

const subreddits = [
	'memes',
	'DeepFriedMemes',
	'bonehurtingjuice',
	'surrealmemes',
	'dankmemes',
	'meirl',
	'me_irl',
	'funny'
];


module.exports = class Memetic extends Command {

	constructor() {
		super({
            name: "meme",
            aliases: ["memes"],
            description: "Get random memes from internet",
            usage: "",
            category: "Fun",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message) {
		const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
			.then(response => response.json())
			.then(body => 
				body.data.filter(post => post.mimetype.startsWith('image'))
			);
		const selected = data[Math.floor(Math.random() * data.length)];
		const memEmbed = new MessageEmbed()
		.setColor(message.guild.me.displayColor)
			.setTitle(':black_joker: Memes!')
			.setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
		return message.channel.send(selected ? {embeds:[memEmbed]} : 'No Image Found');
	}

};
