const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dr', 'remrole'],
			description: 'Remove a role from member',
			usage: `${prefix}delrole <user> <role>`,
			category: 'Moderation'
		});
	}

	async run(message, args) {
		const member = message.mentions.members.last() || message.guild.members.get(args[0]);
		const rname = args[1];
		if (!rname) return message.channel.send('You need to pass role name in order to remove it');
		const role = message.guild.roles.cache.find(rol => rol.name === `${rname}`);
		if (!role) return message.channel.send(`Sorry, there's no role named ${rname}`);

		if (!role.editable) return message.channel.send('Error removing that role, maybe it\'s higher than my role');
		return member.roles.remove(role, `removed by ${message.author.tag}`).then(() => message.channel.send(` ${member} you're removed from **${role.name}** by ${message.member.nickname}`));
	}

};
