
const { prefix } = require('../../../config.json');

module.exports = class DelRole extends Command {

	constructor() {
		super({
            name: "delrole",
            aliases: ["dr"],
            description: "Remove role of choice from target member",
            usage: "",
            category: "Moderation",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const member = message.mentions.members.last() || message.guild.members.get(args[0]);
		const rname = args[1];
		if (!rname) return message.channel.send('You need to pass role name in order to remove it');
		const role = message.guild.roles.cache.find(rol => rol.name === `${rname}`);
		if (!role) return message.channel.send(`Sorry, there's no role named ${rname}`);

		if (!role.editable) return message.channel.send('Error removing that role, maybe it\'s higher than my role');
		return member.roles.remove(role, `removed by ${message.author.tag}`).then(() => message.channel.send(` ${member} you're removed from **${role.name}** by **${message.member.nickname ? message.member.nickname : message.member.user.username}**`));
	}

};
