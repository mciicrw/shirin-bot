
const { prefix } = require('../../../config.json');

module.exports = class SelfRoleRmv extends Command {

	constructor() {
		super({
            name: "selfremoverole",
            aliases: ["iamnot","removerole"],
            description: "Remove your role of choice",
            usage: "",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const rname = args[0];
		if (!rname) return message.channel.send('You need to pass role name in order to remove');
		const role = message.member.roles.cache.find(rol => rol.name === `${rname}`);
		if (!role) return message.channel.send(`You're not a member of role named ${rname}`);

		if (!role.editable) return message.channel.send('Error removing that role, maybe it\'s higher than my role');
		return message.member.roles.remove(role, 'Selfrole request').then(() => message.channel.send(`You're now removed from **${role.name}**!`));
	}

};
