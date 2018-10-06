var pool = require('./dbconn');
var squel = require('squel');
var moment = require('moment');
var dbutils = require('./dbutils');

exports.getCommentList = function(req, res) {

	const commentSql = squel.select()
		.field("DATE_FORMAT(c.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("c.id")
		.field("c.comment")
		.field("u.uid")
		.field("u.name")
		.field("u.picture")
		.from("comments", "c")
		.left_join("users", "u", "c.creator_id = u.uid")
		.where("c.item_id = ?", req.query.item_id)
		.order("id", false);

	pool.query(commentSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			comments:result
		});
	});

}


exports.postAddComment = function(req, res) {

	const insertSql = squel.insert()
		.into("comments")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("item_id", req.body.params.item_id)
		.set("creator_id", req.body.params.creator_id)
		.set("comment", dbutils.escapeString(req.body.params.comment));

	pool.query(insertSql.toString(), function (err, result) {
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		})
	});

}

exports.postDeleteComment = function(req, res) {

	const deleteSql = squel.delete()
		.from("comments")
		.where("id = ?", req.body.params.id);

	pool.query(deleteSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

}

exports.postUpdateComment = function(req, res) {

	const updateSql = squel.update()
		.table("comments")
		.set("comment", dbutils.escapeString(req.body.params.comment))
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

}

exports.getCommentListAll = function(req, res) {

	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("comments");


	const sql = squel.select()
		.field("DATE_FORMAT(c.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("c.id")
		.field("c.comment")
		.field("u.uid")
		.field("u.name")
		.field("u.picture")
		.from("comments", "c")
		.left_join("users", "u", "c.creator_id = u.uid")
		.order("id", false)
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		if (err){
			console.log(err);
		}
		pool.query(sql.toString(), function(err, result){
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				comments:result,
				count: count ? count[0].count : 1
			});
		});
	});


}

