const Event = require('../../Structures/Event.js');
// const { welcome } = require('../../../config.json');
const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');

const applyWelcomeText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px fira-sans-bold`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 100);

	// Return the result to use in the actual canvas
	return ctx.font;
};

const applyMemberCountText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 50;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px fira-sans-bold`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 100);

	// Return the result to use in the actual canvas
	return ctx.font;
};

module.exports = class extends Event {

	async run(member) {
		/*
		const welcom = welcome;
		const welcomeCh = member.guild.channels.cache.find(ch => ch.id === welcom);
		if (!welcomeCh) return console.log('No welcome channel provided, please create one!');

		return welcomeCh.send(`Welcome to ${member.guild.name} ${member} :wave: Please read the rule thanks!`);
		*/

		try {
			const data = fs.readFileSync('config.json');
			const obj = JSON.parse(data);

			const leave = obj.welcome;

			const leaveCh = member.guild.channels.cache.find(ch => ch.id === leave);
			if (!leaveCh) return console.log('No welcome channel provided, please create one!');

			const canvas = Canvas.createCanvas(1100, 500);
			const ctx = canvas.getContext('2d');

			const cornerRadius = 20;

			// const background = await Canvas.loadImage('./src/Images/bg.png');
			// ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			// ctx.clip();
			// ctx.fillStyle = '#1a1b26';
			// ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Rounded background
			ctx.lineJoin = 'round';
			ctx.lineWidth = 20;
			ctx.strokeStyle = '#1a1b26';
			ctx.fillStyle = '#1a1b26';
			ctx.strokeRect(0 + (cornerRadius / 2), 0 + (cornerRadius / 2), canvas.width - cornerRadius, canvas.height - cornerRadius);
			ctx.fillRect(0 + (cornerRadius / 2), 0 + (cornerRadius / 2), canvas.width - cornerRadius, canvas.height - cornerRadius);

			// Welcome Text
			ctx.font = applyWelcomeText(canvas, `${member.user.tag} just joined the server`);
			ctx.fillStyle = '#ffffff';
			const xWelcome = (canvas.width / 2) - (ctx.measureText(`${member.user.tag} just joined the server`).width / 2);
			ctx.fillText(`${member.user.tag} just joined the server`, xWelcome, canvas.height * 0.75);

			// Member Count Text
			ctx.font = applyMemberCountText(canvas, `Member #${member.guild.memberCount}`);
			ctx.fillStyle = '#ffffff';
			const xMemberCount = (canvas.width / 2) - (ctx.measureText(`Member #${member.guild.memberCount}`).width / 2);
			ctx.fillText(`Member #${member.guild.memberCount}`, xMemberCount, canvas.height * 0.85);

			// Background circle
			ctx.beginPath();
			ctx.arc(550, 185, 110, 0, Math.PI * 2, true);
			ctx.fillStyle = '#3b4252';
			ctx.fill();
			ctx.closePath();

			// Clipping circle
			ctx.beginPath();
			ctx.arc(550, 185, 100, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			// avatar
			const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
			ctx.drawImage(avatar, 450, 85, 200, 200);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

			// const userLeave = member.user.tag;
			return leaveCh.send(`Welcome to ${member.guild.name} ${member} :wave: Please read the rule thanks!`, attachment);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

};

// not yet cleared
