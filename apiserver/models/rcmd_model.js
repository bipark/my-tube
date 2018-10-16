var pool = require('./dbconn');
var squel = require('squel');
var moment = require('moment');


exports.addRcmdCuration = function(req, res) {

	findCurationfromRcmd(req.body.curation_id, function(result){
		if (!result) {

			const insertSql = squel.insert()
				.into("rcmd_curation")
				.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
				.set("curation_id", req.body.curation_id)
				.set("active", true);

			pool.query(insertSql.toString(), function (err, result) {
				if (err) console.log(err);
				res.send({
					err:err,
					result:result
				});
			});

		} else {
			res.send({
				err:null,
				result:result
			});
		}
	});

}


exports.addRcmdVideo = function(req, res) {

	findVideofromRcmd(req.body.item_id, function(result){
		if (!result) {

			const insertSql = squel.insert()
				.into("rcmd_video")
				.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
				.set("item_id", req.body.item_id)
				.set("active", true);

			pool.query(insertSql.toString(), function (err, result) {
				if (err) console.log(err);
				res.send({
					err:err,
					result:result
				});
			});

		} else {
			res.send({
				err:null,
				result:result
			});
		}
	});

}


function findVideofromRcmd(videoid, callback) {

	const sql = squel.select()
		.field("id")
		.field("item_id")
		.from("rcmd_video")
		.where("item_id = ?", videoid);

	pool.query(sql.toString(), function(err, result){
		if (!result.length){
			callback(err, null);
		} else {
			callback(err, result[0]);
		}
	});

}

function findCurationfromRcmd(videoid, callback) {

	const sql = squel.select()
		.field("id")
		.field("curation_id")
		.from("rcmd_curation")
		.where("curation_id = ?", videoid);

	pool.query(sql.toString(), function(err, result){
		if (!result.length){
			callback(err, null);
		} else {
			callback(err, result[0]);
		}
	});

}

