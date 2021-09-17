/* eslint-disable no-unused-vars */

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


module.exports = class ServerInfo extends Command {

	constructor() {
		super({
            name: "serverinfo",
            aliases: ["server","info"],
            description: "Check current server info",
            usage: "",
            category: "Information",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message) {
		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;
		const owner = await message.guild.fetchOwner();

		const embed = new MessageEmbed()
			.setTitle(`:crossed_swords: | **Guild information for __${message.guild.name}__**`)
			.setColor(message.guild.me.displayHexColor || 3066993)
			.setThumbnail(message.guild.iconURL({dynamic: true, format:'png', size: 64 }))
			.addField(':mag: | General', [
				`**~❯ Owner:** ${owner.user.tag}`,
				`**~❯ Boost Tier:** ${message.guild.premiumTier === 'NONE' ? 'None' : `Tier ${message.guild.premiumTier}`}`,
				`**~❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
				`**~❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
				'\u200b'
			].join('\n'))
			.addField(':chart_with_upwards_trend: | Statistics', [
				`**~❯ Role Count:** ${roles.length}`,
				`**~❯ Emoji Count:** ${emojis.size}(Total), ${emojis.filter(emoji => !emoji.animated).size}(Regular), ${emojis.filter(emoji => emoji.animated).size}(Animated)`,
				`**~❯ Member Count:** ${message.guild.memberCount}(Total), ${members.filter(member => !member.user.bot).size}(Humans), ${members.filter(member => member.user.bot).size}(Bots)`,
				`**~❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
				`**~❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
				`**~❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
				'\u200b'
			].join('\n'))
			.addField(`:speech_left: | Roles [${roles.length}]`, roles.length <= 5 ? roles.join(', ') : roles.length > 5 ? this.client.utils.trimArray(roles).join('\n') : 'None', true)
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		if (message.guild.banner) embed.setImage(message.guild.bannerURL({"format":"png"}));
		// console.log(message.guild.banner);
		message.channel.send({embeds: [embed]});
	}

};
