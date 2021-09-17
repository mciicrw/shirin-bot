require('dotenv').config();

// Import our client structure
const Bot = require('./src/struct/Bot');
const client = new Bot();

// gettoken
const token = process.env.DEPLOY === 'DEV' ? process.env.DEV_TOKEN : process.env.PROD_TOKEN;

// And start the bot
client.start(token);