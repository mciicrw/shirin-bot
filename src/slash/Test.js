module.exports = class SlashTest extends Interaction {
	constructor() {
		super({
			name: "test",
			description: "just testing command",
		});
	}
	async exec(interaction) {
		return interaction.reply({ ephemeral: false, content: `tis`});
	}
};