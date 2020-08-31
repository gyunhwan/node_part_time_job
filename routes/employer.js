var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
/* GET home page. */

//개인정보수정화면
router.get('/change', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employer WHERE employer_id = ? ;',
			[req.query.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employer_change',
					data: row,
					sess: sess
				});
			}
		);
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
			'UPDATE employer SET employer_pw =? , employer_phone =? , employer_address =? WHERE employer_id = ?;',
			[
				req.body.employer_pw,
				req.body.employer_phone,
				req.body.employer_address,
				req.body.employer_id
			],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect('../');
			}
		);
	});
});

//채용게시판수정화면
router.get('/updateboard', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employment_board WHERE employment_board_num = ? ;',
			[req.query.employment_board_num],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employment_board_update',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//채용게시판수정
router.post('/updateboard', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'UPDATE employment_board SET employment_board_name = ?, employment_board_companyname = ? , employment_board_industry = ?, employment_board_period =?, employment_board_day =?, employment_board_time =?, employment_board_salary =?, employment_board_type= ?, employment_board_personnel =?, employment_board_address =? WHERE employment_board_num = ?; ',
			[
				req.body.employment_board_name,
				req.body.employment_board_companyname,
				req.body.employment_board_industry,
				req.body.employment_board_period,
				req.body.employment_board_day,
				req.body.employment_board_time,
				req.body.employment_board_salary,
				req.body.employment_board_type,
				req.body.employment_board_personnel,
				req.body.employment_board_address,
				req.body.employment_board_num
			],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect('../');
			}
		);
	});
});

//구직자목록화면
router.get('/employeelist', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employment WHERE employer_id=? AND state=? OR state = ?;',
			[req.query.employer_id, 1, 2],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', { page: './employee_list', data: row, sess: sess });
			}
		);
	});
});
//구직자평가등록화면
router.get('/evaluation', function(req, res, next) {
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
					page: './employee_evaluation',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//구직자 평가 등록
router.post('/evaluation', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'INSERT INTO employee_evaluation(employee_evaluation_content,employee_evaluation_score,employee_id,employer_id) VALUES (?,?,?,?); ',
			[
				req.body.employee_evaluation_content,
				req.body.employee_evaluation_score,
				req.body.employee_id,
				req.body.employer_id
			],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'UPDATE employment SET evaluation_employer = ? WHERE employee_id = ? AND employer_id=?',
					[1, req.body.employee_id, req.body.employer_id],
					(err, row) => {
						conn.release();
						if (err) {
							throw err;
						}
						res.redirect(
							'../employer/employeelist?employer_id=' + req.query.employer_id
						);
					}
				);
			}
		);
	});
});

//구직자평가내용화면
router.get('/evaluationdatail', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employee_evaluation WHERE employee_id = ? ;',
			[req.query.employee_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employee_evaluation_detail',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//이력서상세화면
router.get('/applicationdatail', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM registration WHERE employee_id = ? ;',
			[req.query.employee_id],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'SELECT * FROM level_of_education WHERE employee_id = ? ;',
					[req.query.employee_id],
					(err, result) => {
						conn.release();
						if (err) {
							throw err;
						}
						res.render('index', {
							page: './application_detail',
							data: row,
							data2: result,
							sess: sess
						});
					}
				);
			}
		);
	});
});

//채용등록화면
router.get('/regist', function(req, res, next) {
	var sess = req.session;
	res.render('index', { page: './employment_regist', sess: sess });
});

//채용등록
router.post('/regist', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'INSERT INTO employment_board(employment_board_name, employment_board_companyname, employment_board_industry, employment_board_period, employment_board_day, employment_board_time, employment_board_salary, employment_board_type, employment_board_personnel, employment_board_address, employer_id) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?); ',
			[
				req.body.employment_board_name,
				req.body.employment_board_companyname,
				req.body.employment_board_industry,
				req.body.employment_board_period,
				req.body.employment_board_day,
				req.body.employment_board_time,
				req.body.employment_board_salary,
				req.body.employment_board_type,
				req.body.employment_board_personnel,
				req.body.employment_board_address,
				req.body.employer_id
			],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect('../');
			}
		);
	});
});

//구직신청조회화면
router.get('/registlist', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employment WHERE employer_id = ? AND state= ?;',
			[req.query.employer_id, 0],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employment_regist_list',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//채용승인
router.get('/registapproval', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'UPDATE employment SET state= ? WHERE employee_id=? AND employer_id=?',
			[1, req.query.employee_id, req.query.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect(
					'../employer/registlist?employer_id=' + req.query.employer_id
				);
			}
		);
	});
});

//채용거절
router.get('/registrefusal', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'DELETE FROM employment WHERE employee_id=? AND employer_id=? ',
			[req.query.employee_id, req.query.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect(
					'../employer/registlist?employer_id=' + req.query.employer_id
				);
			}
		);
	});
});

//구직종료
router.get('/employmentend', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'UPDATE employment SET state= ? WHERE employee_id=? AND employer_id=?',
			[2, req.query.employee_id, req.query.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.redirect(
					'../employer/employeelist?employer_id=' + req.query.employer_id
				);
			}
		);
	});
});

//그룹생성화면
router.get('/groupcreate', function(req, res, next) {
	var sess = req.session;

	res.render('index', { page: './group_create', sess: sess });
});

//그룹생성
router.post('/groupcreate', function(req, res, next) {
	var sess = req.session;
	var result;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.beginTransaction(function(err) {
			conn.query(
				'INSERT INTO newgroup(group_name,group_area,group_grade_code,group_leader) VALUES (?,?,?,?); ',
				[
					req.body.group_name,
					req.body.group_area,
					req.body.group_grade_code,
					sess.info.employer_id
				],
				function(err, row) {
					if (err) {
						console.error(err);
					}
					conn.query(
						'SELECT group_num FROM newgroup WHERE group_leader=?',
						[sess.info.employer_id],
						(err, row) => {
							if (err) {
								conn.release();
								throw err;
							}
							result = row[0].group_num;
							console.log(result);
							conn.query(
								'UPDATE employer SET group_num=?,group_state=2 WHERE employer_id=?',
								[result, sess.info.employer_id],
								function(err, row) {
									if (err) {
										conn.release();
										console.error(err);
									}
									console.log(row);

									conn.commit(function(err) {
										if (err) {
											console.error(err);
										}
										conn.release();
										res.redirect('../');
									});
								}
							);
						}
					);
				}
			);
		});
	});
});

//그룹신청
router.post('/group/application/:groupnum', function(req, res, next) {
	var sess = req.session;
	var group_num = req.params.groupnum;

	pool.getConnection((err, conn) => {
		conn.query(
			'UPDATE employer SET group_num=?,group_state=? WHERE employer_id=?',
			[group_num, 0, sess.info.employer_id],
			function(err, row) {
				if (err) {
					conn.release();
					console.error(err);
				}
				conn.query(
					'SELECT * FROM group_board WHERE group_num=? ',
					[group_num],
					(err, row) => {
						conn.release();
						if (err) {
							console.error(err);
						}
						res.render('index', {
							page: './error',
							sess: sess,
							data: row,
							message: '그룹 신청 검토중 입니다.'
						});
					}
				);
			}
		);
	});
});
//그룹 멤버 승인하기
router.get('/group/userok', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		conn.query(
			'SELECT *FROM newgroup,employer WHERE newgroup.group_leader=employer.employer_id',
			function(err, row) {
				conn.release();
				if (err) {
					console.error(err);
				}

				res.render('index', { page: './group_list', sess: sess, data: row });
			}
		);
	});
});
//그룹 보기
router.get('/group/list', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		conn.query(
			'SELECT *FROM newgroup,employer WHERE newgroup.group_leader=employer.employer_id',
			function(err, row) {
				conn.release();
				if (err) {
					console.error(err);
				}

				res.render('index', { page: './group_list', sess: sess, data: row });
			}
		);
	});
});

//그룹게시판화면
router.get('/group/board/:groupnum', function(req, res, next) {
	var sess = req.session;
	console.log('holy moly');

	if (sess.info.group_state == 2) {
		pool.getConnection((err, conn) => {
			conn.query(
				'SELECT * FROM group_board WHERE group_num=? ',
				[sess.info.group_num],
				function(err, row) {
					conn.release();
					if (err) {
						console.error(err);
					}
					if (row == []) {
						res.reder('index', {
							page: './group_board',
							sess: sess,
							data: row
						});
					} else {
						res.render('index', {
							page: './group_board',
							sess: sess,
							data: row
						});
					}
				}
			);
		});
	} else {
		res.render('index', {
			page: './error',
			sess: sess,
			message: '이 그룹의 멤버가 아닙니다. 뒤로가기를 눌러주세요'
		});
	}
});

//그룹게시판상세화면
router.get('/groupdetail/:groupboardnum', function(req, res, next) {
	var sess = req.session;
	if (sess.info.group_state == 2) {
		console.log(req.params.groupboardnum);

		pool.getConnection((err, conn) => {
			conn.query(
				'SELECT * FROM group_board WHERE group_board_num=?',
				[req.params.groupboardnum],
				function(err, row) {
					if (err) {
						conn.release();
						console.error(err);
					}
					conn.query(
						'SELECT * FROM comment WHERE group_board_num=?',
						[req.params.groupboardnum],
						(err, row2) => {
							conn.release();
							if (err) {
								console.error(err);
							}
							console.log(row2);

							res.render('index', {
								page: './group_board_detail',
								comment: row2,
								sess: sess,
								data: row
							});
						}
					);
				}
			);
		});
	} else {
		res.render('index', {
			page: './error',
			sess: sess,
			message: '이 그룹의 멤버가 아닙니다. 뒤로가기를 눌러주세요'
		});
	}
});

//그룹게시판등록화면
router.get('/group/board/regist/:group_num', function(req, res, next) {
	var sess = req.session;

	res.render('index', { page: './group_board_regist', sess: sess });
});
//그룹 게시판 등록
router.post('/group/board/regist/:group_num', function(req, res, next) {
	var sess = req.session;
	console.log(req.params.group_num);

	pool.getConnection((err, conn) => {
		conn.query(
			'INSERT INTO group_board (group_num,group_board_content,group_board_name,employer_id) VALUES(?,?,?,?)',
			[
				req.params.group_num,
				req.body.content,
				req.body.name,
				sess.info.employer_id
			],
			(err, row) => {
				if (err) {
					conn.release();
					console.error(err);
				}
				conn.query(
					'SELECT * FROM group_board WHERE group_num=?',
					[req.params.group_num],
					(err, row) => {
						conn.release();
						if (err) {
							console.log(err);
						}
						res.redirect(`../${req.params.group_num}`);
					}
				);
			}
		);
	});
});
//그룹 게시판 수정화면
router.get('/group/board/update/:group_num', function(req, res, next) {
	var sess = req.session;
	console.log(req.params.group_num);

	pool.getConnection((err, conn) => {
		conn.query(
			'SELECT * FROM group_board WHERE group_board_num=?',
			[req.params.group_num, sess.info.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					console.error(err);
				}
				res.render('index', {
					page: './group_board_update',
					sess: sess,
					data: row
				});
			}
		);
	});
});
//그룹게시판수정
router.post('/group/board/update/:group_num', function(req, res, next) {
	var sess = req.session;
	console.log(req.params.group_num);

	pool.getConnection((err, conn) => {
		conn.query(
			'UPDATE group_board SET group_board_name=?,group_board_content=?',
			[req.body.name, req.body.content],
			(err, row) => {
				conn.release();
				if (err) {
					console.error(err);
				}

				res.redirect(`../../../groupdetail/${req.params.group_num}`);
			}
		);
	});
});
//그룹 게시판 삭제
router.get('/group/board/delete/:group_num', function(req, res, next) {
	var sess = req.session;
	var gn = req.params.group_num;
	pool.getConnection((err, conn) => {
		conn.query(
			'DELETE FROM group_board WHERE group_board_num=?',
			[gn],
			(err, row) => {
				conn.release();
				if (err) {
					console.error(err);
				}
				console.log(row);
				res.redirect(`../${sess.info.group_num}`);
			}
		);
	});
});
//그룹 게시판 댓글 등록
router.post('/groupComment', (req, res, next) => {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		conn.query(
			'INSERT INTO comment(group_board_num,employer_id,comment_comment) VALUES(?,?,?)',
			[req.body.num, sess.info.employer_id, req.body.comment],
			(err, row) => {
				conn.release();
				if (err) {
					console.error(err);
				}
				console.log(row);

				res.redirect(`../employer/groupdetail/${req.body.num}`);
			}
		);
	});
});
//그룹 유저 리스트 관리
router.get('/group/userok/:employer_id', function(req, res, next) {
	var sess = req.session;

	pool.getConnection((err, conn) => {
		if (err) {
			console.error(err);
		}
		if (req.query.method == 'cancle') {
			console.log('취소');
			conn.query(
				'UPDATE employer SET group_state=0,group_num=0 WHERE employer_id=?',
				[req.params.employer_id],
				(err, row) => {
					if (err) {
						conn.release();
						console.error(err);
					}
					conn.query(
						'SELECT * FROM employer WHERE group_num=?',
						[sess.info.group_num],
						(err, row) => {
							conn.release();
							if (err) {
								console.log(err);
							}
							res.render('index', {
								page: './group_user_list',
								sess: sess,
								data: row
							});
						}
					);
				}
			);
		} else if (req.query.method == 'put') {
			console.log('승인');

			conn.query(
				'UPDATE employer SET group_state=2 WHERE employer_id=?',
				[req.params.employer_id],
				(err, row) => {
					if (err) {
						conn.release();
						console.error(err);
					}
					conn.query(
						'SELECT * FROM employer WHERE group_num=? ',
						[sess.info.group_num],
						(err, row) => {
							conn.release();
							if (err) {
								console.log(err);
							}
							res.render('index', {
								page: './group_user_list',
								sess: sess,
								data: row
							});
						}
					);
				}
			);
		} else if (req.query.method == 'delete') {
			console.log(req.param.employer_id);

			conn.query(
				'UPDATE employer SET group_num=0, group_state=0 WHERE employer_id=?',
				[req.params.employer_id],
				(err, row) => {
					if (err) {
						conn.release;
						console.error(err);
					}
					conn.query(
						'SELECT * FROM employer WHERE group_num=? ',
						[sess.info.group_num],
						(err, row) => {
							conn.release();
							if (err) {
								console.log(err);
							}
							res.render('index', {
								page: './group_user_list',
								sess: sess,
								data: row
							});
						}
					);
				}
			);
		}
	});
});
//그룹삭제

//그룹회원목록화면
router.get('/group/userlist', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}

		conn.query(
			'SELECT group_leader FROM newgroup WHERE group_num=?',
			[sess.info.group_num],
			(err, row) => {
				if (err) {
					conn.release();
					throw err;
				}
				console.log(row);
				if (row[0].group_leader != sess.info.employer_id) {
					conn.release();
					res.render('index', {
						page: './error',
						sess: sess,
						data: 'no',
						message:
							'그룹의 리더만 해당화면을 볼수 있습니다. 뒤로가기를 눌러주세요'
					});
				} else {
					conn.query(
						'SELECT * FROM employer WHERE group_num=?',
						[sess.info.group_num],
						(err, row) => {
							conn.release();
							if (err) {
								throw err;
							}
							res.render('index', {
								page: './group_user_list',
								sess: sess,
								data: row
							});
						}
					);
				}
			}
		);
	});
});

module.exports = router;
