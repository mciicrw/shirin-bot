const Event = require('../Structures/Event.js');
// const ms = require('ms');


module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands`,
			`Loaded ${this.client.events.size} events`
		].join(`\n`));
		/*
		const activities = [
			`${this.client.prefix}help for command list`,
			`This bot prefix is ${this.client.prefix}`,
			`Bot Uptime:${ms(this.client.uptime, { long: true })}`
		];

		let i = 0;
		setInterval(() => this.client.user.setActivity(`${activities[i++ % activities.length]}`, { type: 'PLAYING' }), 30000);
		*/
		this.client.user.setActivity(`${this.client.prefix}help | Playing with ${this.client.users.cache.size} user`, { type: 'PLAYING' });
	}

};
