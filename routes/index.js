var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
/* GET home page. */

//메인화면
router.get('/', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query('SELECT * FROM employment_board', (err, row) => {
			conn.release();
			if (err) {
				throw err;
			}
			res.render('index', { page: './main', data: row, sess: sess });
		});
	});
});

//검색화면
router.get('/search', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			"SELECT * FROM employment_board WHERE employment_board_address like '%" +
				req.query.employment_board_address +
				"%'",
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './search', data: row, sess: sess });
			}
		);
	});
});

//채용게시판상세화면 ?
router.get('/detail', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employment_board WHERE employment_board_num = ?',
			[req.query.employment_board_num],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employment_board_detail',
					data: row,
					sess: sess
				});
			}
		);
	});
});

module.exports = router;
