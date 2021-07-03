const Event = require('../../Structures/Event.js');
// const { welcome } = require('../../../config.json');
const fs = require('fs');

module.exports = class extends Event {

	run(member) {
		/*
		const leave = welcome;
		const leaveCh = member.guild.channels.cache.find(ch => ch.id === leave);
		if (!leaveCh) return console.log('No welcome channel provided, please create one!');

		const userLeave = member.user.tag;
		return leaveCh.send(`:red_car::dash: Bye ${userLeave}, have a nice trip! :blue_car::dash:`);
		*/
		try {
			const data = fs.readFileSync('config.json');
			const obj = JSON.parse(data);

			const leave = obj.welcome;

			const leaveCh = member.guild.channels.cache.find(ch => ch.id === leave);
			if (!leaveCh) return console.log('No welcome channel provided, please create one!');

			const userLeave = member.user.tag;
			return leaveCh.send(`:red_car::dash: Bye ${userLeave}, have a nice trip! :blue_car::dash:`);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

};
