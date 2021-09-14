/* eslint-disable no-unused-vars */
const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { prefix } = require('../../../config.json');

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydney: 'Sydney',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['server'],
			description: 'Display server info, now in embed!',
			category: 'Information',
			usage: `${prefix}server`
		});
	}

	async run(message) {
		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;

		const embed = new MessageEmbed()
			.setTitle(`:crossed_swords: | **Guild information for __${message.guild.name}__**`)
			.setColor(message.guild.me.displayHexColor || 3066993)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addField(':mag: | General', [
				`**~❯ Name:** ${message.guild.name}`,
				`**~❯ ID:** ${message.guild.id}`,
				`**~❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
				`**~❯ Region:** ${regions[message.guild.region]}`,
				`**~❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
				`**~❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
				`**~❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
				`**~❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
				'\u200b'
			])
			.addField(':chart_with_upwards_trend: | Statistics', [
				`**~❯ Role Count:** ${roles.length}`,
				`**~❯ Emoji Count:** ${emojis.size}(Total), ${emojis.filter(emoji => !emoji.animated).size}(Regular), ${emojis.filter(emoji => emoji.animated).size}(Animated)`,
				`**~❯ Member Count:** ${message.guild.memberCount}(Total), ${members.filter(member => !member.user.bot).size}(Humans), ${members.filter(member => member.user.bot).size}(Bots)`,
				`**~❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
				`**~❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
				`**~❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
				'\u200b'
			])
			.addField(':white_check_mark: | Presence', [
				`:green_circle: **Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`:yellow_circle: **Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`:red_circle: **Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
				`:black_circle: **Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
				'\u200b'
			], true)
			.addField(`:speech_left: | Roles [${roles.length - 1}]`, roles.length <= 5 ? roles.join(', ') : roles.length > 5 ? this.client.utils.trimArray(roles) : 'None', true)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		if (message.guild.banner) embed.setImage(message.guild.bannerURL({"format":"png"}));
		// console.log(message.guild.banner);
		message.channel.send(embed);
	}

};
