const {pgdb} = require('./db/dbconfig');
const {DataTypes} = require('sequelize');

module.exports = pgdb.define('discord_prod', {
	discord_id: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	owner_id: {
		type: DataTypes.BIGINT
	},
	mod_log_channel: {
		type: DataTypes.BIGINT
	},
	daily_channel: {
		type: DataTypes.BIGINT
	},
	prefix: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false,
	freezeTableName:true
});

