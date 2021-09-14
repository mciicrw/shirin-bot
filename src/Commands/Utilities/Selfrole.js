const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['iam'],
			description: 'Add a role of choice by yourself',
			usage: `${prefix}iam <role>`,
			category: 'Utilities'
		});
	}

	async run(message, args) {
		const rname = args[0];
		if (!rname) return message.channel.send('You need to pass role name in order to add');
		const role = message.guild.roles.cache.find(rol => rol.name === `${rname}`);
		if (!role) return message.channel.send(`Sorry, there's no role named ${rname}`);
		// eslint-disable-next-line id-length
		const dupeRole = message.member.roles.cache.find(r => r.name === `${rname}`);
		if (dupeRole) return message.channel.send('You already have that role!');

		if (!role.editable) return message.channel.send('Error adding that role, maybe it\'s higher than my role');
		return message.member.roles.add(role, 'Selfrole request').then(() => message.channel.send(`Congratulations you are now added to **${role.name}**!`));
	}

};
