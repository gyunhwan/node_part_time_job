var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
var session = require('express-session');
/* GET home page. */

router.get('/', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './main', sess: sess });
});

//employee_login 페이지
router.get('/login', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './employee_login', sess: sess });
});

//employee_login
router.post('/login', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) throw err;
		var sql =
			'SELECT * FROM employee WHERE employee_id = ? AND employee_pw = ?';
		conn.query(
			sql,
			[req.body.employee_id, req.body.employee_pw],
			(err, row) => {
				if (err) {
					res.send(300, {
						result: 0,
						msg: 'DB Error'
					});
				}
				if (row.length === 0) {
					console.log('실패');
					res.redirect('./login');
				} else {
					sess.info = row[0];
					console.log('성공');
					res.redirect('../');
				}
			}
		);
	});
});

//employee_join 페이지
router.get('/join', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './employee_join', sess: sess });
});

//employee_join
router.post('/join', function(req, res, next) {
	var sess = req.session;
	pool.getConnection(function(err, conn) {
		if (err) throw err;
		var sql = 'SELECT * FROM employee WHERE employee_id=?';
		conn.query(sql, [req.body.employee_id], function(err, row) {
			if (err) throw err;
			if (row.length === 0) {
				var sql = 'INSERT INTO employee VALUES (?, ?, ?, ?, ?, ?,?);';
				conn.query(
					sql,
					[
						req.body.employee_id,
						req.body.employee_pw,
						req.body.employee_name,
						req.body.employee_gender,
						req.body.employee_phone,
						req.body.employee_address,
						check
					],
					function(err, row) {
						conn.release();
						if (err) throw err;
						res.render('index', { page: './employee_login', sess: sess });
					}
				);
			} else {
				res.render('index', { page: './employee_login', sess: sess });
			}
		});
	});
});

//employer_login 페이지
router.get('/rlogin', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './employer_login', sess: sess });
});

//employer_login
router.post('/rlogin', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) throw err;
		var sql =
			'SELECT * FROM employer WHERE employer_id = ? AND employer_pw = ?';
		conn.query(
			sql,
			[req.body.employer_id, req.body.employer_pw],
			(err, row) => {
				if (err) {
					res.send(300, {
						result: 0,
						msg: 'DB Error'
					});
				}
				if (row.length === 0) {
					console.log('실패');
					res.redirect('./rlogin');
				} else {
					sess.info = row[0];
					console.log('성공');
					res.redirect('../');
				}
			}
		);
	});
});

//employer_join 페이지
router.get('/rjoin', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './employer_join', sess: sess });
});
//employer_join
router.post('/rjoin', function(req, res, next) {
	var sess = req.session;
	pool.getConnection(function(err, conn) {
		if (err) throw err;
		var sql = 'SELECT * FROM employer WHERE employer_id=?';
		conn.query(sql, [req.body.employer_id], function(err, row) {
			if (err) throw err;
			if (row.length === 0) {
				var sql =
					'INSERT INTO employer VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,?);';
				conn.query(
					sql,
					[
						req.body.employer_id,
						req.body.employer_pw,
						req.body.employer_name,
						req.body.employer_gender,
						req.body.employer_phone,
						req.body.employer_businessnumber,
						req.body.employer_address,
						0,
						0,
						req.body.check,
						0
					],
					function(err, row) {
						conn.release();

						if (err) throw err;

						res.render('index', { page: './employer_login', sess: sess });
					}
				);
			} else {
				res.render('index', { page: './employer_login', sess: sess });
			}
		});
	});
});

//로그아웃 요청
router.get('/logout', function(req, res, next) {
	var sess = req.session;
	sess.destroy();
	res.redirect('/');
});
module.exports = router;
