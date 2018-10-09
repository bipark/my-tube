const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var model = require('./models/models');
var user_model = require('./models/user_models');
var act_model = require('./models/activity_models');
var notice_model = require('./models/notice_model');
var stat_model = require('./models/stat_models');
var comment_model = require('./models/comment_model');
var device_model = require('./models/device_models');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	//intercepts OPTIONS method
	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	} else {
		next();
	}

	// API
	app.get('/api', function(req, res){
		res.send("Welcome to my-tube.")
	});

	// FEATURES
	app.get('/api/features', model.getFeatures);
	app.post('/api/features/hide', model.postHideFeatures);
	app.post('/api/features/add', model.postAddFeatures);
	app.post('/api/features/delete', model.postDeleteFeatures);

	// CONTENTS
	app.get('/api/curation/master', model.getCurationMaster);
	app.get('/api/curation/byid', model.getCurationById);
	app.get('/api/curation/details', model.getCurationDetails);
	app.get('/api/curation/details/byid', model.getCurationListByItemID);

	app.post('/api/youtube/add', model.addYoutubeVideo);

	app.get('/api/video/list', model.getVideoList);
	app.get('/api/video/detail', model.getVideo);
	app.get('/api/video/actions', model.getVideoActions);

	app.post('/api/curation/add', model.postCurationMaster);
	app.post('/api/curation/adddetail', model.postCurationDetail);
	app.post('/api/curation/delete', model.postDeleteCuration);
	app.post('/api/curation/detail/delete', model.postDeleteCurationDetail);
	app.post('/api/curation/update', model.postUpdateCuration);

	app.get('/api/category', model.getCategories);

	// Curation User Action
	app.post('/api/curation/bookmark/add', act_model.postCurationBookmark);
	app.post('/api/curation/like/add', act_model.postBookmarkLike);
	app.post('/api/curation/view/add', act_model.postCurationViewCount);
	app.post('/api/curation/rate/add', act_model.postCurationRate);

	app.post('/api/video/add', model.postVideoData);
	app.post('/api/video/delete', model.postDeleteVideo);
	app.post('/api/video/report', act_model.postReport);
	app.post('/api/video/report/hide', act_model.updateReport);

	app.get('/api/video/report/list', act_model.getReportList);


	// user Activity
	app.post('/api/video/view/add', act_model.postVideoViewCount);
	app.post('/api/video/bookmark/add', act_model.postBookmark);
	app.post('/api/video/like/add', act_model.postLike);
	app.post('/api/video/rate/add', act_model.postItemRate);

	// Search
	app.get('/api/search', model.getSearchText);

	// User Activity Stat
	app.get('/api/user/views', act_model.getUserViewItem);
	app.get('/api/user/likes', act_model.getUserLikeItem);
	app.get('/api/user/bookmarks', act_model.getUserBookmarkItem);

	// Company Info
	app.get('/api/info/:info', model.getCompanyInfo);


	// User Management
	app.get('/api/user/get', user_model.getUser);
	app.get('/api/user/list', user_model.getUserList);

	app.post('/api/user/signup', user_model.signUpUser);
	app.post('/api/user/signin', user_model.loginUser);
	app.post('/api/user/add', user_model.postUser);
	app.post('/api/user/change/scope', user_model.postUserChangeScope);
	app.post('/api/user/change/status', user_model.postUserChangeStatus);
	app.post('/api/user/change/password', user_model.postUserChangePassword);
	app.post('/api/user/delete', user_model.postUserDelete);

	// Device Management
	app.post('/api/device/regist', device_model.postRegistDevice);

	// Contact Us
	app.post('/api/contact/add', user_model.postContactUs);
	app.post('/api/contact/process', user_model.postContactUsProcess);
	app.get('/api/contact/list', user_model.getContactUsList);

	// Notice
	app.get('/api/notice', notice_model.getNotice);
	app.get('/api/notice/list', notice_model.getNoticeList);
	app.post('/api/notice/add', notice_model.postAddNotice);
	app.post('/api/notice/delete', notice_model.postDeleteNotice);
	app.post('/api/notice/hide', notice_model.postHideNotice);
	app.post('/api/notice/update', notice_model.postUpdateNotice);

	// Stat & Settings
	app.get('/api/settings', stat_model.getSettings);

	// Comment
	app.get('/api/comment/list/all', comment_model.getCommentListAll);
	app.get('/api/comment/list', comment_model.getCommentList);
	app.post('/api/comment/add', comment_model.postAddComment);
	app.post('/api/comment/delete', comment_model.postDeleteComment);
	app.post('/api/comment/update', comment_model.postUpdateComment);

});

module.exports = app;
