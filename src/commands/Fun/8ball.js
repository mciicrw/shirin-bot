const answers = [
	'Maybe.',
	'Certainly not.',
	'I hope so.',
	'Not in your wildest dreams.',
	'There is a good chance.',
	'Quite likely.',
	'I think so.',
	'I hope not.',
	'I hope so.',
	'Never!',
	'Fuhgeddaboudit.',
	'Ahaha! Really?!?',
	'Pfft.',
	'Sorry, bucko.',
	'Hell, yes.',
	'Hell to the no.',
	'The future is bleak.',
	'The future is uncertain.',
	'I would rather not say.',
	'Who cares?',
	'Possibly.',
	'Never, ever, ever.',
	'There is a small chance.',
	'Yes!'
];

const { prefix } = require('../../../config.json');
module.exports = class EightBall extends Command {

	constructor() {
		super({
            name: "8ball",
            aliases: ["8b"],
            description: "Test your luck with 8ball",
            usage: `${prefix}8ball`,
            category: "Fun",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, args) {
		return message.reply(args.join(' ').endsWith('?') ?
			`🎱 ${answers[Math.floor(Math.random() * answers.length)]}` :
			'🎱 That doesn\'t seem to be a question, please try again!');
	}

};
