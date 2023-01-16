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
module.exports = { fetchTopics, fetchArticles };