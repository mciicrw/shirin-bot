/* eslint-disable id-length */
const Command = require('../Structures/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			// aliases: ['hi', 'halo'],
			descripton: 'Testing looping embed addfield'
		});
	}

	async run(message) {
		const embedTest = new MessageEmbed()
			.setColor(message.guild.me.displayColor)
			.setTimestamp();
		let descTitle = '';
		let descDesc = '';

		message.channel.send('Welcome to custom embed helper! First of all, what title do you want to use?');
		message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 })
			.then(collected => {
				embedTest.setAuthor(`${collected.first()}`, `${message.guild.iconURL({ dynamic: true })}`);
				message.channel.send('Next, what title do i need to display?');
				message.channel.awaitMessages(m2 => m2.author.id === message.author.id, { max: 1 })
					.then(collected2 => {
						descTitle = collected2.first();
						message.channel.send('Next, what title do i need to display?');
						message.channel.awaitMessages(m3 => m3.author.id === message.author.id, { max: 1 })
							.then(collected3 => {
								descDesc = collected3.first();
								embedTest.addField(`${descTitle}`, `${descDesc}`);
								message.channel.send(embedTest);
							});
					});
			})
			.catch(() => message.channel.send('Operation timed out!'));
	}

};
