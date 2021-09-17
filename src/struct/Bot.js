const { Client, Collection, Intents } = require('discord.js');
const { resolve } = require('path');
const { sync } = require('glob');
const config = require('../../config.json');
const Util = require('../utils/Utility');
const Scheduled = require('../utils/Scheduled');

require('./Interaction');
require('./Command');
require('./Event');

module.exports = class Bot extends Client {
    constructor() {
        super({
            intents: Object.values(Intents.FLAGS),
            allowedMentions: {
                repliedUser: false,
            },
        });
        this.prefix = process.env.DEPLOY ==='DEV' ? config.devPrefix : config.prefix;
        this.cooldowns = new Collection();
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.owners = config.owners;
        this.logger = require('../utils/Logger');
        this.interactions = new Collection();
        this.utils = new Util(this);
        this.schedule = new Scheduled(this);
    }

    // Load slash commands
    async loadInteractions() {
        const intFile = await sync(resolve('./src/slash/**/*.js'));
        intFile.forEach((filepath) => {
            const File = require(filepath);
            if (!(File.prototype instanceof Interaction)) return;
            const interaction = new File();
            interaction.client = this;
            this.interactions.set(interaction.name, interaction);
            this.application?.commands.create(interaction);
        })
    }


    // Load basic commands
    async loadCommands() {
        const cmdFile = await sync(resolve('./src/commands/**/*.js'));
        cmdFile.forEach((filepath) => {
            const File = require(filepath);
            if (!(File.prototype instanceof Command)) return;
            const command = new File();
            command.client = this;
            this.commands.set(command.name, command);
            command.aliases.forEach((alias) => {
                this.aliases.set(alias, command.name);
            })
        })
    }
    // Load events
    async loadEvents() {
        const evtFile = await sync(resolve('./src/events/**/*.js'));
        evtFile.forEach((filepath) => {
            const File = require(filepath);
            if (!(File.prototype instanceof Event)) return;
            const event = new File();
            event.client = this;
            this.events.set(event.name, event);
            const emitter = event.emitter ? typeof event.emitter === "string" ? this[event.emitter] : emitter : this;
            emitter[event.type ? "once": "on"](event.name, (...args) => event.exec(...args));
        })
    }
    // Start function
    async start(token) {
        this.loadCommands();
        this.loadEvents();
        super.login(token);
    }
}