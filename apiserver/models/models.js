var pool = require('./dbconn');
var squel = require('squel');
var async = require('async');
var dbutils = require('./dbutils');
var moment = require('moment');
var axios = require('axios');

require('dotenv').config();


exports.addYoutubeVideo = function(req, res) {

	const creator_id = req.headers.authorization;

	const video_id = req.body.param.link;
	const curation_id = req.body.param.curation_no;
	const uid = req.body.param.uid;

	const params = {
		id: video_id,
		key: process.env.GOOGLE_API_KEY,
		part: "snippet,contentDetails,statistics,status"
	};

	axios.get("https://www.googleapis.com/youtube/v3/videos", {params:params})
		.then((result)=>{

			//console.log(result.data.items[0]);

			var datas = result.data.items[0];
			const findvideo = squel.select()
				.field("*")
				.from("items")
				.where("video_id = ?", video_id);

			const items = squel.insert()
				.into("items")
				.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
				.set("publishedDate", moment(datas.snippet.publishedAt).format('YYYY/MM/DD HH:mm:ss'))
				.set("creator_id", creator_id)
				.set("title", dbutils.escapeString(datas.snippet.title))
				.set("note", dbutils.escapeString(datas.snippet.description))
				.set("tags", datas.snippet.tags ? dbutils.escapeString(datas.snippet.tags.join(",")) : null)
				.set("video_id", video_id)
				.set("thumb_default", datas.snippet.thumbnails.default ? datas.snippet.thumbnails.default.url : null)
				.set("thumb_medium", datas.snippet.thumbnails.medium ? datas.snippet.thumbnails.medium.url : null)
				.set("thumb_high", datas.snippet.thumbnails.high ? datas.snippet.thumbnails.high.url : null)
				.set("thumb_standard", datas.snippet.thumbnails.standard ? datas.snippet.thumbnails.standard.url : null)
				.set("thumb_maxres", datas.snippet.thumbnails.maxres ? datas.snippet.thumbnails.maxres.url : null)
				.set("channelTitle", dbutils.escapeString(datas.snippet.channelTitle))
				.set("duration", dbutils.escapeString(datas.contentDetails.duration))
				.set("definition", dbutils.escapeString(datas.contentDetails.definition))
				.set("datas", Buffer.from(JSON.stringify(datas)).toString('base64'));

			pool.query(findvideo.toString(), function (err, result) {
				if (result.length > 0) {
					res.send({
						err:'비디오가 이미 존재 합니다. ID : '+result[0].id,
						result:result
					});
				} else {
					pool.query(items.toString(), function (err, result) {

						if (err) {
							res.send({
								err:err,
								result:result
							});

						} else {

							if (curation_id === undefined) {
								res.send({
									err:err,
									result:result
								});
							} else {
								const video_id = result.insertId;
								const insertDetailSql = squel.insert()
									.into("curation_detail")
									.set("master_id", curation_id)
									.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
									.set("item_id", video_id);

								pool.query(insertDetailSql.toString(), function (err, result) {
									res.send({
										err:err,
										result:result
									})
								});

							}

						}

					});
				}

			});


		})
		.catch((error)=>{
			console.log(error);
			res.send({
				err:"서버 통신중에 오류가 발생했습니다",
				result:null
			})
		});


};

exports.getFeatures = function(req, res) {

	const all = (req.query.all == undefined) ? false : true;

	const countSql = squel.select()
		.field("count(*) count")
		.from("features", "i");

	const featureSql = squel.select()
		.field("i.*")
		.field("f.active")
		.field("f.id", "fid")
		.from("features", "f")
		.left_join("items", "i", "i.id = f.item_id")
		.order("id", false);

	if (!all) {
		featureSql.where("f.active = ?", "1")
	}

	pool.query(countSql.toString(), function (err, count) {
		pool.query(featureSql.toString(), function (err, features) {
			res.send({
				err:err,
				features:features,
				count: count ? count[0].count : 1
			});
		});
	});


};


exports.postHideFeatures = function(req, res) {

	const updateSql = squel.update()
		.table("features")
		.set("active", parseInt(req.body.params.active))
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err){
			console.log(err);
		}
		res.send({
			err:err,
			result:result
		});
	});

}

exports.postAddFeatures = function(req, res) {

	const findSql = squel.select()
		.field("id")
		.from("items")
		.where("id = ?", req.body.params.item_id);

	const updateSql = squel.insert()
		.into("features")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("item_id", req.body.params.item_id);

	pool.query(findSql.toString(), function(err, find){
		if (!find.length) {
			res.send({
				err:"존재하지 않는 비디오 번호 입니다.",
				result:null
			});
		} else {
			pool.query(updateSql.toString(), function(err, result){
				if (err){
					console.log(err);
				}
				res.send({
					err:err,
					result:result
				});
			});
		}
	});


}


exports.postDeleteFeatures = function(req, res) {

	const updateSql = squel.delete()
		.from("features")
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err){
			console.log(err);
		}
		res.send({
			err:err,
			result:result
		});
	});

}


exports.getVideo = function(req, res) {

	const item_id = req.query.id;
	const videoSql = squel.select()
		.field("it.*")
		.field("DATE_FORMAT(it.createdDate, \'%Y-%m-%d\') cdate ")
		.field(squel.select().field("avg(item_rate)").from("item_rates").where("item_id = ?", item_id), "item_avg_rate")
		.field(squel.select().field("count(*)").from("likes").where("item_id = ?", item_id), "like_count")
		.field(squel.select().field("count(*)").from("bookmarks").where("item_id = ?", item_id), "bookmark_count")
		.field(squel.select().field("count(*)").from("item_views").where("item_id = ?", item_id), "view_count")
		.from("items", "it")
		.where("it.id = ?", item_id);

	pool.query(videoSql.toString(), function (err, video) {
		res.send({
			err:err,
			video:video
		});
	});

};

exports.getVideoActions = function(req, res) {

	const item_id = req.query.item_id;
	const creator_id = req.headers.authorization;

	const selBookmarkSql = squel.select()
		.field("*")
		.from("bookmarks")
		.where("item_id = ?", item_id)
		.where("creator_id = ?", creator_id);

	const selLikeSql = squel.select()
		.field("*")
		.from("likes")
		.where("item_id = ?", item_id)
		.where("creator_id = ?", creator_id);

	const selRateSql = squel.select()
		.field("*")
		.from("item_rates")
		.where("item_id = ?", item_id)
		.where("creator_id = ?", creator_id);

	async.series({
		bookmark: function (cb2) {
			pool.query(selBookmarkSql.toString(), function (err, bookmark) {
				cb2(err, bookmark);
			});
		},
		like: function(cb2) {
			pool.query(selLikeSql.toString(), function (err, likes) {
				cb2(err, likes);
			});
		},
		rate: function(cb2) {
			pool.query(selLikeSql.toString(), function (err, rate) {
				cb2(err, rate);
			});
		},
	}, function (err, datas) {
		res.send({
			err:err,
			bookmark:!datas.bookmark.length ? null : datas.bookmark[0],
			like:!datas.like.length ? null : datas.like[0],
			rate:!datas.rate.length ? null : datas.rate[0]
		})
	});


};


exports.getVideoList = function(req, res) {

	const limit = (req.query.limit == undefined) ? 18 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const isshow = (req.query.isshow == undefined) ? false : true;
	const popular_order = (req.query.popular_order == undefined) ? false : true;

	const countSql = squel.select()
		.field("count(*) count")
		.from("items", "i");

	const ItemSql = squel.select()
		.field("i.*")
		.from("items", "i")
		.limit(limit)
		.offset(offset);

	if (popular_order) {
		ItemSql.order("i.actions", false);
	} else {
		ItemSql.order("i.id", false);
	}

	if (isshow) {
		ItemSql.where("i.isshow = 1");
		countSql.where("i.isshow = 1");
	}

	pool.query(countSql.toString(), function(err, count){
		pool.query(ItemSql.toString(), function(err, result){
			res.send({
				err:err,
				videolist:result,
				count: count ? count[0].count : 1
			})
		});
	});


};

exports.getHotVideoList = function(req, res) {

	const limit = (req.query.limit == undefined) ? 18 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("item_views", "views")
		.join("items", "items", "views.item_id = items.id")
		.where("(DATE_FORMAT(views.createdDate, '%Y-%m-%d') > DATE_SUB(NOW(), INTERVAL 30 DAY))")
		.where("items.isshow = 1");

	const ItemSql = squel.select()
		.field("views.item_id")
		.field("count(*)", "viewCount")
		.field("items.*")
		.from("item_views", "views")
		.join("items", "items", "views.item_id = items.id")
		.where("(DATE_FORMAT(views.createdDate, '%Y-%m-%d') > DATE_SUB(NOW(), INTERVAL 30 DAY))")
		.where("items.isshow = 1")
		.group("views.item_id")
		.order("viewCount", false)
		.limit(limit)
		.offset(offset);

	pool.query(countSql.toString(), function(err, count){
		pool.query(ItemSql.toString(), function(err, result){
			res.send({
				err:err,
				videolist:result,
				count: count ? count[0].count : 1
			})
		});
	});


};


exports.postVideoData = function(req, res) {


	let datas = req.body.params.datas;
	if (datas.length > 0) {

		datas = datas[0];
		const video_id = datas.id;

		const findvideo = squel.select()
			.field("*")
			.from("items")
			.where("video_id = ?", video_id);

		const items = squel.insert()
			.into("items")
			.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
			.set("publishedDate", moment(datas.snippet.publishedAt).format('YYYY/MM/DD HH:mm:ss'))
			.set("creator_id", req.body.params.creator_id)
			.set("title", dbutils.escapeString(datas.snippet.title))
			.set("note", dbutils.escapeString(datas.snippet.description))
			.set("tags", datas.snippet.tags ? datas.snippet.tags.join(",") : null)
			.set("video_id", video_id)
			.set("thumb_default", datas.snippet.thumbnails.default ? datas.snippet.thumbnails.default.url : null)
			.set("thumb_medium", datas.snippet.thumbnails.medium ? datas.snippet.thumbnails.medium.url : null)
			.set("thumb_high", datas.snippet.thumbnails.high ? datas.snippet.thumbnails.high.url : null)
			.set("thumb_standard", datas.snippet.thumbnails.standard ? datas.snippet.thumbnails.standard.url : null)
			.set("thumb_maxres", datas.snippet.thumbnails.maxres ? datas.snippet.thumbnails.maxres.url : null)
			.set("channelTitle", datas.snippet.channelTitle)
			.set("duration", datas.contentDetails.duration)
			.set("definition", datas.contentDetails.definition)
			.set("isshow", 1)
			.set("datas", Buffer.from(JSON.stringify(datas)).toString('base64'));

		pool.query(findvideo.toString(), function (err, result) {
			if (result.length > 0) {
				res.send({
					err:'비디오가 이미 존재 합니다.',
					result:result
				});
			} else {
				pool.query(items.toString(), function (err, result) {
					if (err) {
						console.log(err);
					}
					res.send({
						err:err,
						result:result
					})
				});
			}

		});

	} else {
		res.send({
			err:'Params.Datas Error',
			result:null
		});
	}

};

exports.postDeleteVideo = function(req, res) {

	const deleteVideoSql = squel.delete()
		.from("items")
		.where("id = ?", req.body.params.id);

	pool.query(deleteVideoSql.toString(), function (err, result) {
		res.send({
			err:err,
			curations:result
		})
	});

};

exports.getCurationMaster = function(req, res) {

	const limit = (req.query.limit == undefined) ? 10 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));
	const detail_limit = (req.query.detail_limit == undefined) ? 100 : parseInt(req.query.detail_limit);
	const isshow = (req.query.isshow == undefined) ? false : true;
	const popular_order = (req.query.popular_order == undefined) ? false : true;
	const israndom = req.query.israndom == undefined ? false : true;
	const category = req.query.category;

	const countSql = squel.select()
		.field("count(*) count")
		.from("curation_master", "cm");

	const curationMaster = squel.select()
		.field("cm.id")
		.field("DATE_FORMAT(cm.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("cm.title")
		.field("cm.description")
		.field("cm.tag")
		.field("cm.category")
		.field("IF(cm.isshow, True, False)", "isshow")
		.field(squel.select().field("count(*)").from("curation_views").where("curation_id = cm.id"), "view_count")
		.from("curation_master", "cm")
		.limit(limit)
		.offset(offset);

	if (popular_order) {
		curationMaster.order("cm.actions", false);
	} else {
		if (israndom) {
			curationMaster.order("rand()");
		} else {
			curationMaster.order("cm.id", false);
		}
	}

	if (isshow) {
		curationMaster.where("cm.isshow = 1");
		countSql.where("cm.isshow = 1");
	}

	if (category) {
		curationMaster.where("category = ?", category);
		countSql.where("category = ?", category);
	}

	pool.query(countSql.toString(), function (err, count) {

		pool.query(curationMaster.toString(), function (err, result) {

			// Get Details...
			async.each(result, function(master, cb) {
				const curid = master.id;
				const selectCurationDetailSql = squel.select()
					.field("cd.id", "pid")
					.field("it.*")
					.from("curation_detail", "cd")
					.where("cd.master_id = ?", curid)
					.where("it.isshow = ?", 1)
					.join("items", "it", "it.id = cd.item_id")
					.order("it.id", true)
					.limit(detail_limit);

				pool.query(selectCurationDetailSql.toString(), function (err, details) {
					master.details = details;
					cb();
				});

			}, function () {
				res.send({
					err:err,
					curations:result,
					count: count ? count[0].count : 1
				})
			});

		});

	});

};

exports.getCurationById = function(req, res) {

	const curid = req.query.curationid;
	const isshow = req.query.isshow;
	const creator_id = req.headers.authorization;

	const selectCurationMasterSql = squel.select()
		.field("cm.id")
		.field("DATE_FORMAT(cm.createdDate, \'%Y-%m-%d\') cdate ")
		.field("cm.title")
		.field("cm.description")
		.field(squel.select().field("curation_rate").from("curation_rates").where("curation_id = ?", curid).where("create_user = ?", creator_id), "curation_rate")
		.field(squel.select().field("avg(curation_rate)").from("curation_rates").where("curation_id = ?", curid), "curation_avg_rate")
		.field(squel.select().field("count(*)").from("clikes").where("curation_id = ?", curid), "like_count")
		.field(squel.select().field("count(*)").from("cbookmarks").where("curation_id = ?", curid), "bookmark_count")
		.field(squel.select().field("count(*)").from("curation_views").where("curation_id = ?", curid), "view_count")
		.from("curation_master", "cm")
		.where("cm.id = ?", curid);

	const selectCurationDetailSql = squel.select()
		.field("cd.id", "pid")
		.field("it.*")
		.from("curation_detail", "cd")
		.where("cd.master_id = ?", curid)
		.where("it.isshow = ?", isshow)
		.join("items", "it", "it.id = cd.item_id")
		.order("it.id", true);

	const selBookmarkSql = squel.select()
		.field("*")
		.from("cbookmarks")
		.where("curation_id = ?", curid)
		.where("creator_id = ?", creator_id);

	const selLikeSql = squel.select()
		.field("*")
		.from("clikes")
		.where("curation_id = ?", curid)
		.where("creator_id = ?", creator_id);

	async.series({
		master: function (cb2) {
			pool.query(selectCurationMasterSql.toString(), function (err, master) {
				cb2(err, master);
			});
		},
		curations: function (cb2) {
			pool.query(selectCurationDetailSql.toString(), function (err, curations) {
				cb2(err, curations);
			});
		},
		bookmark: function (cb2) {
			pool.query(selBookmarkSql.toString(), function (err, bookmark) {
				cb2(err, bookmark);
			});
		},
		like: function(cb2) {
			pool.query(selLikeSql.toString(), function (err, likes) {
				cb2(err, likes);
			});
		},
	}, function (err, datas) {
		res.send({
			err:err,
			master:datas.master,
			curations:datas.curations,
			bookmark:!datas.bookmark.length ? null : datas.bookmark[0],
			like:!datas.like.length ? null : datas.like[0]
		})
	});



};


exports.getCurationDetails = function(req, res) {

	const curid = req.query.curationid;
	const selectCurationDetailSql = squel.select()
		.field("it.*")
		.from("curation_detail", "cd")
		.where("cd.master_id = ?", curid)
		.left_join("items", "it", "it.id = cd.item_id");

	pool.query(selectCurationDetailSql.toString(), function (err, result) {
		res.send({
			err:err,
			details:result
		})
	});

};

exports.getCurationListByItemID = function(req, res) {

	const creator_id = req.headers.authorization;
	const item_id = req.query.item_id;
	const curation_id = req.query.curation_id;

	const selectCurationMasterSql = squel.select()
		.field("cm.id")
		.field("DATE_FORMAT(cm.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("cm.title")
		.field("cm.description")
		.from("curation_master", "cm");
	if (curation_id) {
		selectCurationMasterSql.where("cm.id = ?", curation_id);
	} else {
		selectCurationMasterSql.where("cm.id = ?", squel.select().field("master_id").from("curation_detail").where("item_id = ?", item_id).limit(1));
	}

	const selCurationDetailSql = squel.select()
		.field("cd.id", "pid")
		.field("it.*")
		.field("DATE_FORMAT(cd.createdDate, '%Y-%m-%d') cdate ")
		.field(squel.select().field("item_rate").from("item_rates").where("item_id = ?", item_id).where("create_user = ?", creator_id), "item_rate")
		.field(squel.select().field("avg(item_rate)").from("item_rates").where("item_id = ?", item_id), "item_avg_rate")
		.field(squel.select().field("count(*)").from("likes").where("item_id = ?", item_id), "like_count")
		.field(squel.select().field("count(*)").from("bookmarks").where("item_id = ?", item_id), "bookmark_count")
		.field(squel.select().field("count(*)").from("item_views").where("item_id = ?", item_id), "view_count")
		.from("curation_detail", "cd")
		.where("cd.master_id = ?", squel.select().field("master_id").from("curation_detail").where("item_id = ?", item_id).limit(1))
		.join("items", "it", "it.id = cd.item_id")
		.order("it.id", true);

	const selBookmarkSql = squel.select()
		.field("*")
		.from("bookmarks")
		.where("item_id = ?", item_id)
		.where("creator_id = ?", creator_id);

	const selLikeSql = squel.select()
		.field("*")
		.from("likes")
		.where("item_id = ?", item_id)
		.where("creator_id = ?", creator_id);

	async.series({
		curation: function (cb2) {
			pool.query(selectCurationMasterSql.toString(), function (err, curation) {
				cb2(err, curation);
			});
		},
		item: function (cb2) {
			pool.query(selCurationDetailSql.toString(), function (err, item) {
				cb2(err, item);
			});
		},
		bookmark: function (cb2) {
			pool.query(selBookmarkSql.toString(), function (err, bookmark) {
				cb2(err, bookmark);
			});
		},
		like: function(cb2) {
			pool.query(selLikeSql.toString(), function (err, likes) {
				cb2(err, likes);
			});
		},
	}, function (err, datas) {
		res.send({
			err:err,
			master:!datas.curation.length ? null : datas.curation[0],
			details:datas.item,
			bookmark:!datas.bookmark.length ? null : datas.bookmark[0] ,
			like:!datas.like.length ? null : datas.like[0]
		})
	});

};

exports.postCurationMaster = function(req, res) {

	const insertMasterSql = squel.insert()
		.into("curation_master")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("creator_id", req.body.params.creator_id)
		.set("title", req.body.params.title)
		.set("category", req.body.params.category)
		.set("tag", req.body.params.tag)
		.set("isshow", req.body.params.isshow)
		.set("description", req.body.params.description);

	pool.query(insertMasterSql.toString(), function (err, result) {
		res.send({
			err:err,
			result:result
		})
	});

};


exports.postCurationDetail = function(req, res) {

	const findSql = squel.select()
		.field("*")
		.from("items")
		.where("id = ?", req.body.params.item_id);

	const insertDetailSql = squel.insert()
		.into("curation_detail")
		.set("master_id", req.body.params.master_id)
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("item_id", req.body.params.item_id);

	pool.query(findSql.toString(), function(err, result){
		if (result.length > 0) {
			pool.query(insertDetailSql.toString(), function (err, result) {
				res.send({
					err:err,
					result:result
				})
			});
		} else {
			res.send({
				err:"입력한 번호의 동영상이 존재 하지 않습니다.",
				result:result
			})
		}
	});


};

exports.postDeleteCuration = function(req, res) {

	const deleteDetailSql = squel.delete()
		.from("curation_detail")
		.where("id = ?", req.body.params.curid);

	const deleteMasterSql = squel.delete()
		.from("curation_master")
		.where("id = ?", req.body.params.curid);

	pool.query(deleteDetailSql.toString(), function(err, result){
		if (err) {
			res.send({
				err:err,
				result:result
			})
		} else {
			pool.query(deleteMasterSql.toString(), function (err, result) {
				res.send({
					err:err,
					result:result
				})
			});
		}
	});

};

exports.postDeleteCurationDetail = function(req, res) {


	const deleteDetailSql = squel.delete()
		.from("curation_detail")
		.where("id = ?", req.body.params.id);

	pool.query(deleteDetailSql.toString(), function(err, result){
		res.send({
			err:err,
			result:result
		});
	});

};

exports.postUpdateCuration = function(req, res) {

	const updateDetailSql = squel.update()
		.table("curation_master")
		.set("title", req.body.params.title)
		.set("description", req.body.params.description)
		.set("category", req.body.params.category)
		.set("tag", req.body.params.tag)
		.set("isshow", req.body.params.isshow)
		.set("updatedDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.where("id = ?", req.body.params.id);

	pool.query(updateDetailSql.toString(), function(err, result){
		res.send({
			err:err,
			result:result
		});
	});

};

exports.getCategories = function(req, res) {

	const findSql = squel.select()
		.field("distinct category", "category")
		.field("count(*)", "count")
		.from("curation_master")
		.where("isshow = 1")
		.group("category")
		.order("category");

	pool.query(findSql.toString(), function(err, result){
		res.send({
			err:err,
			result:result
		});
	});

};


exports.getSearchText = function(req, res) {

	const creator_id = req.headers.authorization;
	const searchText = "%"+req.query.query+"%";

	const cuSql = squel.select()
		.field("cm.id")
		.field("DATE_FORMAT(cm.createdDate, \'%Y-%m-%d\') createdDate ")
		.field("cm.title")
		.field("cm.description")
		.from("curation_master", "cm")
		.where("cm.title like ? OR cm.tag like ?", searchText, searchText)
		.where("isshow = 1");

	const ItemSql = squel.select()
		.field("i.*")
		.from("items", "i")
		.where("i.title like ? OR i.note like ? ", searchText, searchText)
		.where("isshow = 1");

	async.series({
		curations: function (cb2) {
			pool.query(cuSql.toString(), function (err, curations) {
				cb2(err, curations);
			});
		},
		videos: function (cb2){
			pool.query(ItemSql.toString(), function (err, videos) {
				cb2(err, videos);
			});
		}
	}, function (err, datas) {

		// Get Details...
		async.each(datas.curations, function(master, cb) {
			const curid = master.id;
			const selectCurationDetailSql = squel.select()
				.field("cd.id", "pid")
				.field("it.*")
				.from("curation_detail", "cd")
				.where("cd.master_id = ?", curid)
				.join("items", "it", "it.id = cd.item_id")
				.order("it.id", false)
				.limit(6);

			pool.query(selectCurationDetailSql.toString(), function (err, details) {
				master.details = details;
				cb();
			});

		}, function () {

			saveSearchHistories(creator_id, req.query.query);
			const count = datas.curations.length + datas.videos;
			res.send({
				err:err,
				curations: datas.curations,
				details: datas.videos,
				searchText: count == 0 ? "검색결과가 없습니다." : req.query.query
			})
		});

	});

}

function saveSearchHistories(creator_id, keyword) {

	const insertSearchSql = squel.insert()
		.into("search_histories")
		.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("creator_id", creator_id)
		.set("keyword", keyword);

	pool.query(insertSearchSql.toString(), function (err, result) {
	});

}

exports.getCompanyInfo = function(req, res) {

	const findSql = squel.select()
		.field("content")
		.from("company_info")
		.where("kind = ?", req.params.info);

	pool.query(findSql.toString(), function (err, result) {
		res.send({
			err:err,
			content:!result.length ? null : result[0]
		})
	});

}

exports.getFeatureList = function (req, res) {

	const selectSql = squel.select()
		.field("it.*")
		.from("features", "f")
		.join("items", "it", "it.id = f.item_id")
		.order("f.id", false);

	pool.query(selectSql.toString(), function (err, result) {
		res.send({
			err:err,
			features:result
		})
	});

}