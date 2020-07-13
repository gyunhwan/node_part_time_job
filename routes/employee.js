var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
/* GET home page. */

//구직신청화면 ?(이중쿼리)
router.get('/', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employment_board WHERE employment_board_num = ?',
			[employment_board_num],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './main', data: row, sess: sess });
			}
		);
	});
});

//채용자평가내용화면 ?
router.get('/', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employer_evaluation WHERE employer_id = ?',
			[employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './main', data: row, sess: sess });
			}
		);
	});
});

//개인정보수정화면 ?
router.get('/change', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employee WHERE employee_id = ? ;',
			[req.query.employee_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employee_change',
					data: row,
					sess: sess
				});
			}
		);
	});
});
//이력서 페이지
router.get('/application', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './application', sess: sess });
});
//이력서 등록
router.post('/application/submit', function(req, res, next) {
	var sess = req.session;
	res.render('main', { page: './main', sess: sess });
});
router.get('/evaluation', function(req, res, next) {
	var sess = req.session;
	res.render('/evaluation', {
		page: './employee_evaluation_detail',
		sess: sess
	});
});
//개인정보수정
router.post('/change', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'UPDATE employee SET employee_pw =? , employee_phone =? , employee_address =? WHERE employee_id = ?;',
			[
				req.body.employee_pw,
				req.body.employee_phone,
				req.body.employee_address,
				req.body.employee_id
			],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './main', data: row, sess: sess });
			}
		);
	});
});

//이력서등록화면 ?
router.get('/resume', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM resume WHERE employee_id ',
			[employee_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './main', data: row, sess: sess });
			}
		);
	});
});

//채용자목록화면 ?

//채용자평가화면 ?

module.exports = router;
