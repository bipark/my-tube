var pool = require('./dbconn');
var squel = require('squel');
var async = require('async');
var dbutils = require('./dbutils');
var moment = require('moment');
var crypto = require('crypto');
// var sgMail = require('@sendgrid/mail');

function findUserSecretByEmail(email, callback) {

	const sql = squel.select()
		.field("uid")
		.field("password")
		.field("pkey")
		.from("users")
		.where("uid = ?", email);

	pool.query(sql.toString(), function(err, result){
		if (!result.length){
			callback(err, null);
		} else {
			callback(err, result[0]);
		}
	});

}

function findUserByEmail(email, callback) {

	const sql = squel.select()
		.field("id")
		.field("uid")
		.field("strategy")
		.field("name")
		.field("scope")
		.field("picture")
		.field("autoplay")
		.field("recvnoti")
		.field("mailconfirm")
		.from("users")
		.where("uid = ?", email);

	pool.query(sql.toString(), function(err, result){
		if (!result.length){
			callback(err, null);
		} else {
			callback(err, result[0]);
		}
	});

}

// function sendSignUpMail(user) {
// 	sgMail.setApiKey(process.env.SENDGRID_KEY);
//
// 	let email_string = "<div>안녕하세요. 세상의 모든 광고동영상(cfvdo.com) 가입을 환영합니다.</div>"+
// 		"<div>아래 링크를 누르고 가입하신 이메일을 인증 할 수 있습니다.</div> "+
// 		"<br/>"+
// 		"<a href='https://cfvdo.com/user/checkmail?emailcert=user.id' target=_blank>이메일 인증</a>"+
// 		"<br/> 감사합니다.<br/>";
//
// 	email_string = email_string.replace('user.id', user.id);
//
// 	const msg = {
// 		to: user.uid,
// 		from: 'info@practical.kr',
// 		subject: '세상의 모든 광고동영상(cfvdo.com) 가입을 환영합니다.',
// 		html: email_string
// 	};
// 	sgMail.send(msg)
// 		.then(()=>{
// 			console.log('MAIL SEND OK');
// 		})
// 		.catch((err)=>{
// 			console.log(err);
// 		})
// }

exports.getUser = function(req, res) {

	findUserByEmail(req.query.uid, function(err, result){
		res.send({
			err:null,
			user:result
		});
	});

}

exports.postUser = function(req, res) {

	const user = req.body.user;
	findUserByEmail(user.uid, function(err, result){
		if (!result){
			const insertUserSql = squel.insert()
				.into("users")
				.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
				.set("uid", user.uid)
				.set("picture", user.picture)
				.set("strategy", user.strategy)
				.set("name", user.name);

			pool.query(insertUserSql.toString(), function (err, result) {
				if (err){
					console.log(err);
				}
				findUserByEmail(user.uid, function(err, result){
					res.send({
						err:err,
						result:result
					});
				})
			});
		} else {
			res.send({
				err:null,
				result:result
			});
		}
	});

};

exports.signUpUser = function(req, res) {

	const user = req.body.user;

	findUserByEmail(user.email, function(err, result) {
		if (result) {
			res.send({
				err: "이미 존재하는 이메일 입니다.",
				result: null
			})
		} else {

			const length = 32;
			const salt = crypto.randomBytes(Math.ceil(length/2)).toString('base64');

			makePassword(user.password1, salt, (err, hashed)=>{

				const insertUserSql = squel.insert()
					.into("users")
					.set("createdDate", moment().format('YYYY/MM/DD HH:mm:ss'))
					.set("uid", user.email)
					.set("pkey", salt)
					.set("password", hashed)
					.set("picture", "https://s3.ap-northeast-2.amazonaws.com/rtlink/profile.png")
					.set("strategy", "email")
					.set("name", user.name);
				pool.query(insertUserSql.toString(), function (err, result) {
					if (err) console.log(err);

					findUserByEmail(user.email, function(err, result){
						// sendSignUpMail(result);
						res.send({
							err:err,
							result:result
						});
					})
				});

			});

		}
	});
}

exports.loginUser = function(req, res) {

	const user = req.body.user;
	findUserSecretByEmail(user.email, function(err, result) {
		if (result) {

			const salt = result.pkey;
			makePassword(user.password, salt, (err, hashed)=>{
				if (hashed === result.password) {
					findUserByEmail(user.email, function(err, result){
						res.send({
							err:err,
							user:result
						});
					})
				} else {
					res.send({
						err: "로그인 정보가 정확하지 않습니다.",
						result: null
					})
				}
			});

		} else {
			res.send({
				err: "존재하지 않는 이메일입니다.",
				result: null
			})
		}
	});

}

function makePassword(password, salt, callback) {
	crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key)=>{
		callback(err, key.toString('base64'));
	});
}

exports.postUserChangePassword = function(req, res) {

	findUserSecretByEmail(req.body.email, function(err, result) {
		if (result) {

			const salt = result.pkey;
			makePassword(req.body.password0, salt, (err, hashed)=>{
				if (hashed === result.password) {
					makePassword(req.body.password1, salt, (err, hashed2)=>{

						const updateSql = squel.update()
							.table("users")
							.set("password = ?", hashed2)
							.where("uid = ?", req.body.email);
						pool.query(updateSql.toString(), function(err, result){
							if (err) console.log(err);
							findUserByEmail(req.body.email, function(err, result){
								res.send({
									err:err,
									user:result
								});
							})
						});

					});
				} else {
					res.send({
						err: "기존 패스워드가 일치하지 않습니다.",
						result: null
					})
				}
			});

		} else {
			res.send({
				err: "존재하지 않는 이메일을 입력 했습니다.",
				result: null
			})
		}
	});

};


exports.getUserList = function(req, res) {


	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));
	const kind = req.query.kind;
	const search = '%'+req.query.search+'%';

	const countSql = squel.select()
		.field("count(*) count")
		.from("users");
	if (kind) {
		if (kind == 'name') {
			countSql.where("name like ?",  search);
		} else {
			countSql.where("uid like ?",  search);
		}
	}


	const sql = squel.select()
		.field("DATE_FORMAT(u.createdDate, \'%Y-%m-%d %H:%i\') createdDate ")
		.field("id")
		.field("strategy")
		.field("uid")
		.field("name")
		.field("scope")
		.field("picture")
		.from("users", "u")
		.order("id", false)
		.limit(limit)
		.offset(offset);
	if (kind) {
		if (kind == 'name') {
			sql.where("name like ?",  search);
		} else {
			sql.where("uid like ?",  search);
		}
	}

	pool.query(countSql.toString(), function(err, count){
		if (err) console.log(err);

		pool.query(sql.toString(), function(err, result){
			if (err) console.log(err);
			res.send({
				err:err,
				users:result,
				count: count ? count[0].count : 1
			});
		});
	});


};

exports.postUserChangeScope = function(req, res) {

	const updateSql = squel.update()
		.table("users")
		.set("scope = ?", "admin")
		.where("id = ?", req.body.params.id);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

};

exports.postUserChangeStatus = function(req, res) {

	const updateSql = squel.update()
		.table("users")
		.set("autoplay = ?", req.body.params.autoplay)
		.set("recvnoti = ?", req.body.params.recvnoti)
		.where("uid = ?", req.body.params.uid);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

};

exports.postUserDelete = function(req, res) {

	const updateSql = squel.delete()
		.from("users")
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

};

exports.postContactUs = function(req, res) {

	const insertSql = squel.insert()
		.into("contact")
		.set("created", moment().format('YYYY/MM/DD HH:mm:ss'))
		.set("title", req.body.params.title)
		.set("email", req.body.params.email)
		.set("description", req.body.params.description);

	pool.query(insertSql.toString(), function (err, result) {
		res.send({
			err:err,
			result:result
		})
	});

}

exports.getContactUsList = function(req, res) {

	const limit = (req.query.limit == undefined) ? 30 : parseInt(req.query.limit);
	const page = (req.query.page == undefined) ? 1 : parseInt(req.query.page);
	const offset = (limit * (page - 1));

	const countSql = squel.select()
		.field("count(*) count")
		.from("contact");

	const sql = squel.select()
		.field("DATE_FORMAT(c.created, \'%Y-%m-%d\') created ")
		.field("c.id")
		.field("c.title")
		.field("c.email")
		.field("c.description")
		.field("u.name")
		.field("u.picture")
		.field("DATE_FORMAT(c.processed, \'%Y-%m-%d\') processed ")
		.from("contact", "c")
		.left_join("users", "u", "c.email = u.uid")
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
				contacts:result,
				count: count ? count[0].count : 1
			});
		});
	});

}

exports.postContactUsProcess = function(req, res) {

	const updateSql = squel.update()
		.table("contact")
		.set("processed = ?", moment().format('YYYY/MM/DD HH:mm:ss'))
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

};

exports.postUserRegistDevice = function(req, res) {

	const updateSql = squel.update()
		.table("users")
		.set("dos = ?", req.body.params.dos)
		.set("dname = ?", req.body.params.dname)
		.set("dtoken = ?", req.body.params.dtoken)
		.where("uid = ?", req.body.params.uid);

	pool.query(updateSql.toString(), function(err, result){
		if (err) console.log(err);
		res.send({
			err:err,
			result:result
		});
	});

};
