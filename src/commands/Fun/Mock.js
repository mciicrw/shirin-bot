
const { prefix } = require('../../../config.json');

module.exports = class Mocking extends Command {

	constructor() {
		super({
            name: "mock",
            aliases: [],
            description: "Mock your text",
            usage: "",
            category: "Fun",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const text = args.join(' ');
		const textEven = text.toLowerCase().split('');
		const textOdd = text.toLowerCase().split('');

		for (let i = 1 - 1; i <= textOdd.length - 1; i += 2) {
			textOdd[i] = textOdd[i].toUpperCase();
		}

		for (let i = 2 - 1; i <= textEven.length - 1; i += 2) {
			textEven[i] = textEven[i].toUpperCase();
		}

		const textArr = [`${textEven.join('')}`, `${textOdd.join('')}`];

		return message.channel.send(textArr[Math.floor(Math.random() * textArr.length)]);
	}

};
