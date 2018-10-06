var pool = require('./dbconn');
var squel = require('squel');
var async = require('async');
var dbutils = require('./dbutils');
var moment = require('moment');
var requestIp = require('request-ip');

exports.postVideoViewCount = function(req, res) {

	const clientIp = requestIp.getClientIp(req);

	const creator_id = req.headers.authorization;
	const item_id = req.body.params.item_id;

	const findSql = squel.select()
		.field("*")
		.from("item_views")
		.where("item_id = ?", item_id)
		.where("create_user = ?", creator_id);

	const insertDetailSql = squel.insert()
		.into("item_views")
		.set("item_id", item_id)
		.set("ipaddress", clientIp)
		.set("create_user", creator_id)
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'));

	pool.query(findSql.toString(), function (err, result) {
		AddItemViewAction(item_id, 1);

		if (!result.length) {
			pool.query(insertDetailSql.toString(), function (err, result) {
				if (err){
					console.log(err);
				}
				res.send({
					err:err,
					result:result
				})
			});
		} else {
			res.send({
				err:err,
				result:null
			})
		}
	});


};

exports.postBookmark = function(req, res) {

	const bookmark_id = req.body.params.bookmark_id;
	const item_id = req.body.params.item_id;
	const kind = req.body.params.kind;
	const creator_id = req.headers.authorization;

	if (kind) {
		// ADD
		const insertBookmarkSql = squel.insert()
			.into("bookmarks")
			.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
			.set("creator_id", creator_id)
			.set("item_id", item_id);

		pool.query(insertBookmarkSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddItemAction(item_id, 1);
			res.send({
				err:err,
				result:result
			})
		});
	} else {
		// DELETE
		const deleteBookmarkSql = squel.delete()
			.from("bookmarks")
			.where("id = ?", bookmark_id);

		pool.query(deleteBookmarkSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddItemAction(item_id, -1);
			res.send({
				err:err,
				result:result
			})
		});
	}

};

exports.postLike = function(req, res) {

	const like_id = req.body.params.like_id;
	const item_id = req.body.params.item_id;
	const kind = req.body.params.kind;
	const creator_id = req.headers.authorization;

	if (kind) {
		// ADD
		const insertLikeSql = squel.insert()
			.into("likes")
			.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
			.set("creator_id", creator_id)
			.set("item_id", item_id);

		pool.query(insertLikeSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddItemAction(item_id, 1);

			res.send({
				err:err,
				result:result
			})
		});
	} else {
		// DELETE
		const deleteLikeSql = squel.delete()
			.from("likes")
			.where("id", like_id);

		pool.query(deleteLikeSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddItemAction(item_id, -1);
			res.send({
				err:err,
				result:result
			})
		});
	}

};

exports.postItemRate = function(req, res) {

	const rate = req.body.params.rate;
	const item_id = req.body.params.item_id;
	const creator_id = req.headers.authorization;


	const findSql = squel.select()
		.field("*")
		.from("item_rates")
		.where("item_id = ?", item_id)
		.where("create_user = ?", creator_id);

	const updateSql = squel.update()
		.table("item_rates")
		.set("item_rate", rate)
		.where("item_id = ?", item_id)
		.where("create_user = ?", creator_id);

	const insertSql = squel.insert()
		.into("item_rates")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("create_user", creator_id)
		.set("item_rate", rate)
		.set("item_id", item_id);

	pool.query(findSql.toString(), function(err, result){

		if (!result.length) {
			AddItemAction(item_id, 1);
			pool.query(insertSql.toString(), function(err, result){
				res.send({
					err:err,
					result:result
				})
			});
		} else {
			pool.query(updateSql.toString(), function(err, result){
				res.send({
					err:err,
					result:result
				})
			});
		}

	});

}

exports.postCurationRate = function(req, res) {

	const rate = req.body.params.rate;
	const curation_id = req.body.params.curation_id;
	const creator_id = req.headers.authorization;


	const findSql = squel.select()
		.field("*")
		.from("curation_rates")
		.where("curation_id = ?", curation_id)
		.where("create_user = ?", creator_id);

	const updateSql = squel.update()
		.table("curation_rates")
		.set("curation_rate", rate)
		.where("curation_id = ?", curation_id)
		.where("create_user = ?", creator_id);

	const insertSql = squel.insert()
		.into("curation_rates")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("create_user", creator_id)
		.set("curation_rate", rate)
		.set("curation_id", curation_id);

	pool.query(findSql.toString(), function(err, result){

		if (!result.length) {
			pool.query(insertSql.toString(), function(err, result){
				AddCurationAction(curation_id, 1);
				res.send({
					err:err,
					result:result
				})
			});
		} else {
			pool.query(updateSql.toString(), function(err, result){
				res.send({
					err:err,
					result:result
				})
			});
		}

	});

};

exports.postBookmarkLike = function(req, res) {

	const like_id = req.body.params.like_id;
	const curation_id = req.body.params.curation_id;
	const kind = req.body.params.kind;
	const creator_id = req.headers.authorization;

	if (kind) {
		// ADD
		const insertLikeSql = squel.insert()
			.into("clikes")
			.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
			.set("creator_id", creator_id)
			.set("curation_id", curation_id);

		pool.query(insertLikeSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddCurationAction(curation_id, 1);

			res.send({
				err:err,
				result:result
			})
		});
	} else {
		// DELETE
		const deleteLikeSql = squel.delete()
			.from("clikes")
			.where("id", like_id);

		pool.query(deleteLikeSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				result:result
			})
		});
	}

};

exports.postCurationViewCount = function(req, res) {

	const creator_id = req.body.params.creator_id ? req.body.params.creator_id : null;
	const curation_id = req.body.params.curation_id;

	const insertDetailSql = squel.insert()
		.into("curation_views")
		.set("curation_id", curation_id)
		.set("create_user", creator_id)
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'));

	pool.query(insertDetailSql.toString(), function (err, result) {
		if (err){
			console.log(err);
		}
		res.send({
			err:err,
			result:result
		})
	});

};

exports.postCurationBookmark = function(req, res) {

	const bookmark_id = req.body.params.bookmark_id;
	const curation_id = req.body.params.curation_id;
	const kind = req.body.params.kind;
	const creator_id = req.headers.authorization;

	if (kind) {
		// ADD
		const insertBookmarkSql = squel.insert()
			.into("cbookmarks")
			.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
			.set("creator_id", creator_id)
			.set("curation_id", curation_id);

		pool.query(insertBookmarkSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			AddCurationAction(curation_id, 1);
			res.send({
				err:err,
				result:result
			})
		});
	} else {
		// DELETE
		const deleteBookmarkSql = squel.delete()
			.from("cbookmarks")
			.where("id", bookmark_id);

		pool.query(deleteBookmarkSql.toString(), function (err, result) {
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				result:result
			})
		});
	}

};

function AddCurationAction(curation_id, value) {

	const updateSql = squel.update()
		.table("curation_master")
		.set("actions = actions + ?", value)
		.where("id = ?", curation_id);

	pool.query(updateSql.toString(), function (err, result) {});

}

function AddItemAction(item_id, value) {

	const updateSql = squel.update()
		.table("items")
		.set("actions = actions + ?", value)
		.where("id = ?", item_id);

	pool.query(updateSql.toString(), function (err, result) {});

}

function AddItemViewAction(item_id, value) {

	const updateSql = squel.update()
		.table("items")
		.set("views =views + ?", value)
		.where("id = ?", item_id);

	pool.query(updateSql.toString(), function (err, result) {});

}


exports.postReport = function(req, res) {

	const insertBookmarkSql = squel.insert()
		.into("report")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("creator_id", req.headers.authorization)
		.set("reason", req.body.params.reason)
		.set("item_id", req.body.params.item_id);

	pool.query(insertBookmarkSql.toString(), function (err, result) {
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		})
	});


}

exports.updateReport = function(req, res) {

	const updateSql = squel.update()
		.table("items")
		.set("isshow", req.body.params.show)
		.where("id = ?", req.body.params.item_id);

	pool.query(updateSql.toString(), function (err, result) {
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		})
	});


}


exports.getReportList = function(req, res) {

	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("report", "r");

	const videoSql = squel.select()
		.field("r.id")
		.field("r.item_id")
		.field("DATE_FORMAT(r.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("r.reason")
		.field("r.creator_id")
		.field("u.uid")
		.field("u.name")
		.field("u.picture")
		.field("i.title")
		.field("i.thumb_medium")
		.field("i.isshow")
		.from("report", "r")
		.order("id", false)
		.left_join("users", "u", "u.uid = r.creator_id")
		.left_join("items", "i", "i.id = r.item_id")
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		if (err){
			console.log(err);
		}
		pool.query(videoSql.toString(), function(err, result){
			if (err){
				console.log(err);
			}
			res.send({
				err: err,
				reports: result,
				count: count ? count[0].count : 1
			})
		});
	});


}

exports.getUserViewItem = function(req, res) {

	const creator_id = req.headers.authorization;

	const limit = (req.query.limit == undefined) ? 36 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("item_views", "v")
		.left_join("items", "i", "i.id = v.item_id")
		.where("i.isshow = ?", true)
		.where("v.create_user = ?", creator_id);

	const viewSql = squel.select()
		.field("v.id", "vid")
		.field("i.*")
		.from("item_views", "v")
		.where("v.create_user = ?", creator_id)
		.where("i.isshow = ?", true)
		.order("v.id", false)
		.left_join("items", "i", "i.id = v.item_id")
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		if (err){
			console.log(err);
		}
		pool.query(viewSql.toString(), function(err, result){
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				views:result,
				count: count ? count[0].count : 1
			})
		});
	});



}

exports.getUserLikeItem = function(req, res) {

	const creator_id = req.headers.authorization;

	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("likes", "v")
		.left_join("items", "i", "i.id = v.item_id")
		.where("i.isshow = ?", true)
		.where("v.creator_id = ?", creator_id);

	const viewSql = squel.select()
		.field("v.id", "vid")
		.field("i.*")
		.from("likes", "v")
		.where("v.creator_id = ?", creator_id)
		.where("i.isshow = ?", true)
		.order("v.id", false)
		.left_join("items", "i", "i.id = v.item_id")
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		if (err){
			console.log(err);
		}

		pool.query(viewSql.toString(), function(err, result){
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				likes:result,
				count: count ? count[0].count : 1
			})
		});
	});


}


exports.getUserBookmarkItem = function(req, res) {

	const creator_id = req.headers.authorization;

	const limit = (req.query.limit == undefined) ? 36 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("bookmarks", "v")
		.left_join("items", "i", "i.id = v.item_id")
		.where("i.isshow = ?", true)
		.where("v.creator_id = ?", creator_id);

	const viewSql = squel.select()
		.field("v.id", "vid")
		.field("i.*")
		.from("bookmarks", "v")
		.where("i.isshow = ?", true)
		.where("v.creator_id = ?", creator_id)
		.order("v.id", false)
		.join("items", "i", "i.id = v.item_id")
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		if (err){
			console.log(err);
		}
		pool.query(viewSql.toString(), function(err, result){
			if (err){
				console.log(err);
			}
			res.send({
				err:err,
				bookmarks:result,
				count: count ? count[0].count : 1
			})
		});
	});



}