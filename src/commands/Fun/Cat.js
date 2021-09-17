
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../../config.json');

const subreddits = [
	'cats',
	'catpics',
	'kittens'
];


module.exports = class CatPics extends Command {

	constructor() {
		super({
            name: "cat",
            aliases: ["kitten"],
            description: "Get cute kitties image from internet",
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
		const catEmbed = new MessageEmbed()
			.setColor(message.guild.me.displayColor)
			.setTitle(':speech_left::cat2: Meow!')
			.setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.channel.send(selected ? {embeds : [catEmbed]}
			: 'No Image Found');
	}

};
