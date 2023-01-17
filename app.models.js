const db = require('./db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then((topics) => {
        return topics.rows;
})
};

const fetchArticles = () => {
    const queryString = 
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`

    return db.query(queryString)
    .then((articles) => {
        return articles.rows;
    })
}


const fetchArticleById = (article_id) => {
    if (!/^\d+$/.test(article_id)) {
        return Promise.reject({status: 400, msg: 'Bad Request'}) 
    }
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(queryString, [article_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article ID Not Found'}) 
        } else return result.rows[0]
            })
        };

const fetchCommentsByArticleId = (article_id) => {
    if (!/^\d+$/.test(article_id)) {
        return Promise.reject({status: 400, msg: 'Bad Request'}) 
    }
    const queryString = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`
    return db.query(queryString, [article_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article ID Not Found'}) 
        } else return result.rows;
    })
}
    
module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId };