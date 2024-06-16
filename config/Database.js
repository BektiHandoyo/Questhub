const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const {DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT} = process.env;

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host : DB_HOST,
    dialect : DB_DATABASE,
    port : DB_PORT,
    logging : false 
})

module.exports = db;