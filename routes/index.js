var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
var fs = require('fs');
/* GET home page. */

//메인화면
router.get('/', function(req, res, next) {
	var sess = req.session;

	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT count(*) as cnt,employer.group_num, group_name FROM employer,newgroup WHERE newgroup.group_num=employer.group_num  GROUP BY employer.group_num ORDER BY group_grade_code DESC LIMIT 10',
			(err, row1) => {
				if (err) {
					conn.release();
					throw err;
				}
				conn.query('SELECT * FROM employment_board', (err, row) => {
					conn.release();
					if (err) {
						console.error(err);
					}
					res.render('index', {
						page: './main',
						data: row,
						sess: sess,
						best10: row1
					});
				});
			}
		);
	});
});
//그룹 채용 확인
router.get('/group', function(req, res, mext) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		conn.query(
			`SELECT a.employment_board_num,
			a.employment_board_name,
			a.employment_board_companyname,
			a.employment_board_industry,
			a.employment_board_period,
			a.employment_board_day,
			a.employment_board_time,
			a.employment_board_salary,
			a.employment_board_type,
			a.employment_board_personnel,
			a.employment_board_address,
			a.employer_id
	FROM employment_board a , employer b , newgroup c
	 WHERE  a.employer_id=b.employer_id AND b.group_num=?;`,
			[req.query.group_num],
			(err, row) => {
				conn.release();
				if (err) {
					console.error(err);
				}
				console.log(row);

				res.render('index', {
					page: './group_employment',
					sess: sess,
					data: row
				});
			}
		);
	});
});
router.get('/imgs/:id', (req, res, next) => {
	console.log(req.params.id);
	fs.readFile(`/${req.params.id}.PNG`, (err, data) => {
		res.writeHead(200, { 'Content-type': 'text/html' });
		res.end(data);
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
