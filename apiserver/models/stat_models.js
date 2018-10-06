var pool = require('./dbconn');
var squel = require('squel');
var async = require('async');
var dbutils = require('./dbutils');
var moment = require('moment');

exports.getSettings = function(req, res) {

	const sql = squel.select()
		.field("*")
		.from("settings")

	pool.query(sql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			settings:result
		});
	});

};

