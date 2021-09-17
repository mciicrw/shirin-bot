
const { prefix } = require('../../../config.json');

module.exports = class SelfRole extends Command {

	constructor() {
		super({
            name: "selfrole",
            aliases: ["iam"],
            description: "Add your own role of choice",
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
