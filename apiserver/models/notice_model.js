var pool = require('./dbconn');
var squel = require('squel');
var moment = require('moment');
var dbutils = require('./dbutils');

exports.getNotice = function(req, res) {

	const noticeSql = squel.select()
		.field("DATE_FORMAT(n.created, \'%Y-%m-%d\') created ")
		.field("n.id")
		.field("n.title")
		.field("n.description")
		.field("n.active")
		.from("notice", "n")
		.where("id = ?", req.query.id);

	pool.query(noticeSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			notice:result.length ? result[0] : null
		});
	});

}


exports.getNoticeList = function(req, res) {

	const all = (req.query.all == undefined) ? false : true;
	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("notice");

	const noticeSql = squel.select()
		.field("DATE_FORMAT(n.created, \'%Y-%m-%d\') created ")
		.field("n.id")
		.field("n.title")
		.field("n.description")
		.field("n.active")
		.from("notice", "n")
		.order("id", false)
		.limit(limit)
		.offset(offset);

	if (!all) {
		noticeSql.where("n.active = ?", "1")
	}

	pool.query(countSql.toString(), function(err, count){
		if (err) console.log(err);
		pool.query(noticeSql.toString(), function(err, result){
			if (err) console.log(err);
			res.send({
				err:err,
				notices:result,
				count: count ? count[0].count : 1
			});
		});
	});

}

exports.postAddNotice = function(req, res) {

	const insertSql = squel.insert()
		.into("notice")
		.set("created", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("title", req.body.params.title)
		.set("description", dbutils.escapeString(req.body.params.description));

	pool.query(insertSql.toString(), function (err, result) {
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		})
	});

}

exports.postDeleteNotice = function(req, res) {

	const deleteSql = squel.delete()
		.from("notice")
		.where("id = ?", req.body.params.id);

	pool.query(deleteSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

}

exports.postHideNotice = function(req, res) {

	const updateSql = squel.update()
		.table("notice")
		.set("active", parseInt(req.body.params.active))
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

}

exports.postUpdateNotice = function(req, res) {

	const updateSql = squel.update()
		.table("notice")
		.set("title", req.body.params.title)
		.set("description", dbutils.escapeString(req.body.params.description))
		.set("created", moment().format('YYYY/MM/DD HH:mm:ss'))
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

}

