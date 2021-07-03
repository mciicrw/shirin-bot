const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../../config.json');

const subreddits = [
	'cats',
	'catpics',
	'kittens'
];


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['catimg', 'catpics'],
			description: 'Send random cat images from internet',
			usage: `${prefix}cat`,
			category: 'Fun'
		});
	}

	async run(message) {
		const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
			.then(response => response.json())
			.then(body => body.data.filter(post => post.mimetype.startsWith('image')));
		const selected = data[Math.floor(Math.random() * data.length)];
		return message.channel.send(selected ? new MessageEmbed()
			.setColor(message.guild.me.displayColor)
			.setTitle(':speech_left::cat2: Meow!')
			.setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp() : 'No Image Found');
	}

};
