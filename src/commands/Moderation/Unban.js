
const { prefix } = require('../../../config.json');

module.exports = class UnBanish extends Command {

	constructor() {
		super({
            name: "unban",
            aliases: ["ub"],
            description: "Remove ban status from user",
            usage: "",
            category: "Moderation",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ["BAN_MEMBERS", "ADMINISTRATOR"],
            clientPerms: [],
        });
	}

	exec(message, args) {
		// if (!message.member.hasPermission(['BAN_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You dont have permission to perform this command!');
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
			this.client.logger.error(e,{tag: 'Commands'});
			return message.reply('Invalid ID, please provide valid user ID');
		}
	}


};
