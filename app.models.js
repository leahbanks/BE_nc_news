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
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(queryString, [article_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article ID Not Found'})
        }
            return result.rows[0]
         })
    }

const fetchCommentsByArticleId = (article_id) => {
    const queryString = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`
    return db.query(queryString, [article_id]).then((result) => {
       return result.rows;
    })
}

const addNewComment = (newComment, article_id) => {
        const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`
        return db.query(queryString, [newComment.username, newComment.body, article_id]).then((result) => {
            return result.rows[0];
          })
        }
    
    
const updateVotes = (increaseVotes, article_id) => {
    const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
    return db.query(queryString, [increaseVotes.inc_votes, article_id]).then((result) => {
        console.log(result.rows[0])
        return result.rows[0];
    }) 
}

    
module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addNewComment, updateVotes };