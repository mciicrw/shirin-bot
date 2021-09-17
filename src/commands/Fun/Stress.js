
const { prefix } = require('../../../config.json');
const fs = require('fs');


module.exports = class StressMan extends Command {

	constructor() {
		super({
            name: "stress",
            aliases: [],
            description: "Stress lu anjing",
            usage: "",
            category: "Fun",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		const tipe = args[0];
		if (!tipe) return message.channel.send('Please pass stress type! Accepted type: halu, wangi, ceplok');

		if (tipe === 'halu') {
			const waifu = args[1];
			if (!waifu) return message.channel.send('Please pass waifu name to be halucinated');
			const haluText = fs.readFileSync('./src/Text/halu.txt', 'utf8');
			const replace = haluText.replace(/(?:^|)name(?:$|)/gi, waifu);
			return message.channel.send(replace);
		} else if (tipe === 'wangi') {
			const waifu = args[1];
			if (!waifu) return message.channel.send('Please pass waifu name to be halucinated');
			const wangiText = fs.readFileSync('./src/Text/wangi.txt', 'utf8');
			const replace = wangiText.replace(/(?:^|)name(?:$|)/gi, waifu);
			return message.channel.send(replace);
		} else if (tipe === 'ceplok') {
			const waifu = args[1].toUpperCase();
			if (!waifu) return message.channel.send('Please pass waifu name to be halucinated');
			const ceplokText = fs.readFileSync('./src/Text/ceplok.txt', 'utf8');
			const replace = ceplokText.replace(/(?:^|)name(?:$|)/gi, waifu);
			return message.channel.send(replace);
		} else {
			return message.channel.send('Unknown stress type! Accepted type(s) are: halu, wangi, ceplok ');
		}
	}

};
