module.exports = class PingOld extends Command {
    constructor() {
        super({
            name: "pingold",
            aliases: ["pongold"],
            description: "Ping command",
            usage: "",
            category: "Misc",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }
    async exec(message, args) {
        await message.channel.sendTyping();
        return message.reply(`My latency: ${Date.now() - message.createdTimestamp}\nAPI Latency: ${this.client.ws.ping}`)
    }
}