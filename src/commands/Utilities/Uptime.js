
const ms = require('ms');

module.exports = class Uptime extends Command {
	constructor(){
		super({
            name: "uptime",
            aliases: [],
            description: "Check bot uptime",
            usage: "",
            category: "Utilities",
            ownerOnly: true,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message) {
		message.channel.send(`My Uptime is \`${ms(this.client.uptime, { long: true })}\``);
	}

};
