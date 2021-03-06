const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const subreddits = [
	'dogpics',
	'dogs',
	'puppies'
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dogimg', 'dogpics'],
			description: 'Send random dog images from internet',
			// usage: '<role>'
			category: 'Fun'
		});
	}

	async run(message) {
		const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
			.then(response => response.json())
			.then(body => body.data.filter(post => post.mimetype.startsWith('image')));
		const selected = data[Math.floor(Math.random() * data.length)];
		return message.channel.send(selected ? new MessageEmbed()
			.setImage(`https://imgur.com/${selected.hash}${selected.ext.replace(/\?.*/, '')}`)
			.setTimestamp() : 'No Image Found');
	}

};
