/* eslint-disable id-length */

const { prefix } = require('../../../config.json');

module.exports = class UnMuted extends Command {

	constructor() {
		super({
            name: "unmute",
            aliases: ["rmuted"],
            description: "Remove Muted Status from user",
            usage: "",
            category: "Moderation",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: ["KICK_MEMBERS", "ADMINISTRATOR"],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		// if (!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) return message.channel.send('You don\'t have permission to do this!');

		const muteMember = message.mentions.members.last() || message.guild.members.get(args[0]);
		if (!muteMember) return message.channel.send('You need to mention member to mute them!');

		if (!muteMember.manageable) return message.channel.send(`Cannot Mute ${muteMember}, maybe he has role higher than me`);

		const role = muteMember.roles.cache.find(ro => ro.name === 'Mute');
		if (!role) {
			return message.channel.send('This member is not muted!')
				.then(m => setTimeout(() => { m.delete(); }, 5000));
		}

		return muteMember.roles.remove(role, `Muted by ${message.author.tag}`).then(() =>
			message.channel.send(`Congratulations ${muteMember} your mute status has been lifted by ${message.author}`));
	}

};
