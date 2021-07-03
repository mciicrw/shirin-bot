const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ar'],
			description: 'Add a role of choice to member',
			usage: `${prefix}addrole <user> <role>`,
			category: 'Moderation'
		});
	}

	async run(message, args) {
		const member = message.mentions.members.last() || message.guild.members.get(args[0]);
		const rname = args[1];
		if (!rname) return message.channel.send('You need to pass role name in order to add it');
		const role = message.guild.roles.cache.find(rol => rol.name === `${rname}`);
		if (!role) return message.channel.send(`Sorry, there's no role named ${rname}`);
		// eslint-disable-next-line id-length
		const dupeRole = message.member.roles.cache.find(r => r.name === `${rname}`);
		if (dupeRole) return message.channel.send(`This member already have have ${rname} role!`);

		if (!role.editable) return message.channel.send('Error adding that role, maybe it\'s higher than my role');
		return member.roles.add(role, `added by ${message.author.tag}`).then(() =>
			message.channel.send(`${member} congratulations you are now added to **${role.name}** by ${message.member.nickname}`));
	}

};
