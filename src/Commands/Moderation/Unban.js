const Command = require('../../Structures/Command.js');
const { prefix } = require('../../../config.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ub', 'rb', 'removeban'],
			description: 'Unban user from server',
			usage: `${prefix}unban <user id number>`,
			category: 'Moderation'
		});
	}

	run(message, args) {
		if (!message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You dont have permission to perform this command!');
		if (isNaN(args[0])) return message.channel.send('You need to provide an ID.');
		const bannedId = args[0];
		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		const auditReason = `${reason} | ${message.author.tag}`;
		try {
			// eslint-disable-next-line id-length
			message.channel.send('User unbanned').then(m => {
				setTimeout(() => {
					m.delete();
				}, 3000);
			});
			return message.guild.members.unban(bannedId, auditReason);

		// eslint-disable-next-line id-length
		} catch (e) {
			console.log(e);
			return message.reply('Invalid ID, please provide valid user ID');
		}
	}


};
