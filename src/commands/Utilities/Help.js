
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');

module.exports = class Help extends Command {

	constructor() {
		super({
            name: "help",
            aliases: [],
            description: "View command list for this bot or help for specific command",
            usage: "",
            category: "Utilities",
            ownerOnly: false,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
	}

	async exec(message, [command]) {
		const helpEmbed = new MessageEmbed()
			.setColor(3066993)
			.setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) return message.channel.send(`Invalid Command named \`${command}\``);

			helpEmbed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
			helpEmbed.setDescription([
				`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases Provided'}`,
				`**❯ Description:** ${cmd.description}`,
				`**❯ Category:** ${cmd.category}`,
				`**❯ Usage:** \`${cmd.usage}\``
			].join('\n'));
			return message.channel.send({embeds: [helpEmbed]});
		} else {
			helpEmbed.setDescription([
				`These are availabe command for ${message.guild.name}`,
				`This bot prefix is \`${this.client.prefix}\``,
				`Command Parameters: \`<>\` is needed and \`[]\` is optional`
			].join('\n'));
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
			} else {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			}

			for (const category of categories) {
				helpEmbed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}
			return message.channel.send({embeds: [helpEmbed]});
		}
	}

};
// not yet completed
// please watch https://www.youtube.com/watch?v=X1SMH0ghbO4&list=PLWnw41ah3I4aduzCTL98zw8PbDO6rGsWm&index=7
// at timestamp 7:14
