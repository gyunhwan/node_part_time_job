var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');
/* GET home page. */

//구직신청화면 ?
router.get('/employeeapplication', function(req, res, next) {
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
					page: './employment_application',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//구직신청
router.post('/employeeapplication', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM registration WHERE employee_id = ?;',
			[req.body.employee_id],
			(err, row) => {
				if (err) {
					throw err;
				}
				if (row.length != 0) {
					conn.query(
						'INSERT INTO employment (employee_id,employer_id,state) VALUES (?,?,?);',
						[req.body.employee_id, req.body.employer_id, req.body.state],
						(err, row) => {
							conn.release();
							if (err) {
								throw err;
							}
							res.redirect('../');
						}
					);
				} else {
					conn.release();
					res.render('index', {
						page: './error',
						sess: sess,
						data: row,
						message: '이력서를 등록하여 주세요.'
					});
				}
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
				res.redirect('../');
			}
		);
	});
});

//이력서등록화면 ?
router.get('/application', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) throw err;
		var sql = 'SELECT * FROM registration WHERE employee_id = ?;';
		conn.query(sql, [req.query.employee_id], (err, row) => {
			if (err) {
				res.send(300, {
					result: 0,
					msg: 'DB Error'
				});
			}
			if (row.length === 0) {
				res.render('index', { page: './application', sess: sess });
			} else {
				res.redirect(
					'../employee/myapplication?employee_id=' + req.query.employee_id
				);
			}
		});
	});
});

//이력서 등록
router.post('/application', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'INSERT registration (registration_name ,registration_number ,registration_year ,registration_month ,registration_day ,registration_address ,registration_tel ,registration_email ,registration_home ,employee_id ,registration_old) VALUES (?,?,?,?,?,?,?,?,?,?,?);',
			[
				req.body.registration_name,
				req.body.registration_number,
				req.body.year,
				req.body.month,
				req.body.day,
				req.body.registration_address,
				req.body.registration_tel,
				req.body.registration_email,
				req.body.registration_home,
				req.body.employee_id,
				req.body.registration_old
			],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'INSERT level_of_education (level_of_education_11,level_of_education_12,level_of_education_13,level_of_education_21,level_of_education_22,level_of_education_23,level_of_education_31,level_of_education_32,level_of_education_33,level_of_education_41,level_of_education_42,level_of_education_43,employee_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
					[
						req.body.level_of_education_11,
						req.body.level_of_education_12,
						req.body.level_of_education_13,
						req.body.level_of_education_21,
						req.body.level_of_education_22,
						req.body.level_of_education_23,
						req.body.level_of_education_31,
						req.body.level_of_education_32,
						req.body.level_of_education_33,
						req.body.level_of_education_41,
						req.body.level_of_education_42,
						req.body.level_of_education_43,
						req.body.employee_id
					],
					(err, row) => {
						conn.release();
						if (err) {
							throw err;
						}

						res.redirect('../');
					}
				);
			}
		);
	});
});

//이력서 수정
router.post('/applicationupdate', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'UPDATE registration SET registration_name = ? ,registration_number = ? ,registration_year = ? ,registration_month =?,registration_day =?,registration_address =?,registration_tel =?,registration_email =?,registration_home =?,employee_id =?,registration_old=?;',
			[
				req.body.registration_name,
				req.body.registration_number,
				req.body.year,
				req.body.month,
				req.body.day,
				req.body.registration_address,
				req.body.registration_tel,
				req.body.registration_email,
				req.body.registration_home,
				req.body.employee_id,
				req.body.registration_old
			],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'UPDATE level_of_education SET level_of_education_11 = ? ,level_of_education_12 = ?,level_of_education_13 = ? ,level_of_education_21 = ? ,level_of_education_22 = ? ,level_of_education_23 = ? ,level_of_education_31 = ?,level_of_education_32 = ?,level_of_education_33 = ? ,level_of_education_41 = ? ,level_of_education_42 = ? ,level_of_education_43 = ? ,employee_id = ?;',
					[
						req.body.level_of_education_11,
						req.body.level_of_education_12,
						req.body.level_of_education_13,
						req.body.level_of_education_21,
						req.body.level_of_education_22,
						req.body.level_of_education_23,
						req.body.level_of_education_31,
						req.body.level_of_education_32,
						req.body.level_of_education_33,
						req.body.level_of_education_41,
						req.body.level_of_education_42,
						req.body.level_of_education_43,
						req.body.employee_id
					],
					(err, row) => {
						conn.release();
						if (err) {
							throw err;
						}

						res.redirect('../');
					}
				);
			}
		);
	});
});

//내이력서정보
router.get('/myapplication', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM registration WHERE employee_id =?;',
			[req.query.employee_id],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'SELECT * FROM level_of_education WHERE employee_id =?;',
					[req.query.employee_id],
					(err, result) => {
						conn.release();
						if (err) {
							throw err;
						}
						res.render('index', {
							page: './application_update',
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

//채용자평가등록화면
router.get('/evaluation', function(req, res, next) {
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
					page: './employer_evaluation',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//채용자 평가 등록
router.post('/evaluation', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'INSERT INTO employer_evaluation(employer_evaluation_content,employer_evaluation_score,employee_id,employer_id) VALUES (?,?,?,?); ',
			[
				req.body.employer_evaluation_content,
				req.body.employer_evaluation_score,
				req.body.employee_id,
				req.body.employer_id
			],
			(err, row) => {
				if (err) {
					throw err;
				}
				conn.query(
					'UPDATE employment SET evaluation_employee = ? WHERE employee_id = ? AND employer_id=?',
					[1, req.body.employee_id, req.body.employer_id],
					(err, row) => {
						if (err) {
							throw err;
						}
						conn.query(
							'UPDATE employer SET employer_grade = employer_grade + ? , employer_grade_count = employer_grade_count + 1 WHERE employer_id = ?',
							[req.body.employer_evaluation_score, req.body.employer_id],
							(err, row) => {
								if (err) {
									throw err;
								}
								conn.query(
									'SELECT * FROM employer WHERE employer_id = ?',
									[req.body.employer_id],
									(err, result) => {
										if (err) {
											throw err;
										}
										var avg =
											result[0].employer_grade / result[0].employer_grade_count;
										var employer_grade_state = 0;
										console.log(avg);
										if (avg >= 4) {
											employer_grade_state = 2;
										} else if (avg < 4 && avg >= 3) {
											employer_grade_state = 1;
										} else {
											employer_grade_state = 0;
										}
										conn.query(
											'UPDATE employer SET employer_grade_state = ? WHERE employer_id = ?;',
											[employer_grade_state, req.body.employer_id],
											(err, row) => {
												if (err) {
													throw err;
												}
												conn.query(
													'UPDATE newgroup SET group_grade_code = ? WHERE group_leader = ?;',
													[employer_grade_state, req.body.employer_id],
													(err, row) => {
														conn.release();
														if (err) {
															throw err;
														}
														res.redirect('../');
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	});
});

//채용자평가내용화면
router.get('/evaluationdatail', function(req, res, next) {
	var sess = req.session;
	var data = {};
	pool.getConnection((err, conn) => {
		if (err) {
			throw err;
		}
		conn.query(
			'SELECT * FROM employer_evaluation WHERE employer_id = ? ;',
			[req.query.employer_id],
			(err, row) => {
				conn.release();
				if (err) {
					throw err;
				}
				res.render('index', {
					page: './employer_evaluation_detail',
					data: row,
					sess: sess
				});
			}
		);
	});
});

//채용자목록화면 ?
router.get('/employerlist', function(req, res, next) {
	var sess = req.session;
	pool.getConnection((err, conn) => {
		if (err) throw err;
		var sql = 'SELECT * FROM employment WHERE employee_id = ? AND state !=0;';
		conn.query(sql, [req.query.employee_id], (err, row) => {
			if (err) {
				res.send(300, {
					result: 0,
					msg: 'DB Error'
				});
			}
			if (row.length === 0) {
				res.render('index', { page: './employer_list', data: [], sess: sess });
			} else {
				res.render('index', { page: './employer_list', data: row, sess: sess });
			}
		});
	});
});

module.exports = router;
