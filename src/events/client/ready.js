module.exports = class Ready extends Event {
	constructor() {
		super({
			name: "ready",
			once: false,
		});
	}
	async exec() {
		this.client.schedule.dailyRotation(this.client);
		this.client.logger.log(`Connected into ${this.client.user.tag}`, { tag: 'Ready' });
		await this.client.loadInteractions();
		this.client.user.setActivity(this.client.guilds.cache.size > 1 ? `${this.client.guilds.cache.size} worlds` : `${this.client.guilds.cache.size} world`, { type: 'WATCHING'});
	}
};