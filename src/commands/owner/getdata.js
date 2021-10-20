const MDiscord = require('../../models/guild');
const {Op} = require('sequelize');

module.exports = class GetDBData extends Command {
	constructor() {
		super({
			name: "getdata",
			aliases: ["gd", "gdb"],
			description: "Eval command",
			usage: "<code>",
			category: "Owner",
			ownerOnly: true,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}

	async exec(message, args) {
		const data = await MDiscord.findAll({
			// attributes: ['mod_log_channel'],
			where: {
				mod_log_channel:{
					[Op.not]: null
				}
			},
            raw: true
		});

        const hhh = data.map((e,i) => {
            return e.mod_log_channel;
        })
		console.log(data);
		return message.reply('data get! check console');
	}
};