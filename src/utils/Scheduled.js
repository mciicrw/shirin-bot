const cron = require('node-cron');
const config = require('../../config.json');
const { rotationData } = require('../assets/data/ObjectCollection');
const botEmbed = require('./EmbedBuilder');
const { DateTime } = require('luxon');
const MDiscord = require('../models/guild');
const {Op} = require('sequelize');

module.exports = class Scheduled {

	async dailyRotation(client) {
		cron.schedule('0 3 * * *', async () => {
			const getLogCh = await MDiscord.findAll({
				attributes: ['daily_channel'],
				where: {
					daily_channel:{
						[Op.not]: null
					}
				}
			});
			const logch = getLogCh.map((e) => e.daily_channel);
			const today = DateTime.now().setZone('Asia/Jakarta').weekday - 1;
			const rotatEmbed = new botEmbed()
				.domainRotation(today)
				.setImage(rotationData[today].image);
			logch.forEach(e => {
				const getch = client.channels.cache.get(e);
				getch.send({embeds: [rotatEmbed]});
			});

		}, {
			timezone: "Asia/Jakarta"
		});

	}

};