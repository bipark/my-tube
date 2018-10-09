var pool = require('./dbconn');
var squel = require('squel');
var moment = require('moment');


exports.postRegistDevice = function(req, res) {

	const sql = squel.select()
		.field("token")
		.from("devices")
		.where("token = ?", req.body.token);

	pool.query(sql.toString(), function(err, tokens){

		if (!tokens.length){

			const insertSql = squel.insert()
				.into("devices")
				.set("deviceos", req.body.os)
				.set("name", req.body.name)
				.set("token", req.body.token)
				.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'));

			pool.query(insertSql.toString(), function(err, result){
				if (err) console.log(err);
				res.send({
					err:err,
					result:result
				});
			});

		} else {

			res.send({
				err:err,
				result:result
			});
		}

	});



};
