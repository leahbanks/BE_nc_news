const db = require('./db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then((topics) => {
        return topics.rows;
})
};

const fetchTopicsByName = (topic) => {
    const queryString = `SELECT * FROM topics WHERE slug = $1`
    return db.query(queryString, [topic]).then((topics) => {
        if (topics.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Topic not found'})
        }
        return topics.rows;
    })
}

const fetchArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
    let queryValues = [];
    const sortBy = ['created_at', 'article_id', 'comment_count', 'author', 'votes', 'title']
    const orderBy = ['ASC', 'DESC']

    let queryString = 
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `

    if (topic) {
        queryValues.push(topic)
        queryString += ` WHERE articles.topic = $1`
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
     
    if (!sortBy.includes(sort_by)) {
        return Promise.reject({status: 404, msg: 'Column does not exist'})
    }
    if (!orderBy.includes(order)) {
        return Promise.reject({status: 400, msg: 'Invalid query'})
     }

    return db.query(queryString, queryValues).then((response) => {
        return response.rows;
    })
}

const fetchArticleById = (article_id) => {
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(queryString, [article_id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Article ID Not Found'})
        }
            return result.rows[0]
         })
    }

const fetchCommentsByArticleId = (article_id) => {
   return fetchArticleById(article_id).then(() => {
    const queryString = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`
    return db.query(queryString, [article_id]).then((result) => {
       return result.rows;
    })
})
}

const addNewComment = (newComment, article_id) => {
    return fetchArticleById(article_id).then(() => {
        const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`
        return db.query(queryString, [newComment.username, newComment.body, article_id]).then((result) => {
            return result.rows[0];
          })
        })
        }
    
    
const updateVotes = (increaseVotes, article_id) => {
    return fetchArticleById(article_id).then(() => {
    const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
    return db.query(queryString, [increaseVotes.inc_votes, article_id]).then((result) => {
        return result.rows[0];
     }) 
  })
}

const fetchUsers = () => {
    const queryString = `SELECT * FROM users;`
    return db.query(queryString).then((users) => {
        return users.rows;
    })
}

module.exports = { fetchTopics, fetchTopicsByName, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addNewComment, updateVotes, fetchUsers };
