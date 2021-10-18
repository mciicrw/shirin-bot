const {Sequelize} = require('sequelize');

const pgdb = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: 'postgres',
	dialectOptions:{
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}

});

const checkConnection = () => new Promise((resolve, reject) => {
	try{
		pgdb.authenticate();
		resolve(true);
	}
	catch(err) {
		reject(err);
	}
});

module.exports = {pgdb, checkConnection};