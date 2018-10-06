require('dotenv').config();
var mysql = require('mysql');

var	pool = mysql.createPool({
	"connectionLimit": 10,
	"host": process.env.DB_HOST,
	"port": process.env.DB_PORT,
	"user": process.env.DB_USERID,
	"password": process.env.DB_PASSWORD,
	"database": process.env.DB_DATABASE,
	"charset": "utf8mb4"
});

module.exports = pool;