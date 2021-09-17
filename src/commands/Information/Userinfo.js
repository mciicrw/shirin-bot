
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { prefix } = require('../../../config.json');

const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};


module.exports = class UserInfo extends Command {

	constructor() {
		super({
            name: "userinfo",
            aliases: ["user","profile"],
            description: "Check your own discord profile",
            usage: "",
            category: "Information",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, [target]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
		const userEmbed = new MessageEmbed()
			.setColor(member.displayHexColor || 3066993)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setTitle(`:memo: | ${member.user.tag}'s profile`)
			.addField(':mag_right: | User', [
				`**~❯ ID:** ${member.id}`,
				`**~❯ Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`**~❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
				`**~❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} (${moment(member.user.createdTimestamp).fromNow()})`,
				'\u200b'
			].join('\n'))
			.addField(':mag_right: | Member', [
				`**~❯ Server Nickname:** ${member.displayName}`,
				`**~❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'none' : member.roles.highest.name}`,
				`**~❯ Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
				`**~❯ Roles [${roles.length}]:** ${roles.length < 5 ? roles.join(', ') : roles.length > 5 ? this.client.utils.trimArray(roles).join('\n') : 'None'}`,
				'\u200b'
			].join('\n'))
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.channel.send({embeds:[userEmbed]});
	}

};
