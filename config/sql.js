var sql = {
    reviewPage : "SELECT * FROM movie, review, member WHERE movie.mCode=review.mCode AND member.mail=review.mail AND movie.mCode=?;",
    reviewDetail: "SELECT * FROM review, reply WHERE review.reviewId=reply.reviewId AND review.reviewId=?",
}

module.exports =  sql;