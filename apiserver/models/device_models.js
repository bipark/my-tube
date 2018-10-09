var pool = require('./dbconn');
var squel = require('squel');


exports.postRegistDevice = function(req, res) {

	const sql = squel.select()
		.field("token")
		.from("devices")
		.where("token = ?", req.body.token);

	pool.query(sql.toString(), function(err, result){

		if (!result.length){

			const insertSql = squel.insert()
				.into("devices")
				.set("dos = ?", req.body.os)
				.set("dname = ?", req.body.name)
				.set("dtoken = ?", req.body.token);

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
