
const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId} = require('./app.models');

const getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics);
    })
}

const getArticles = (req, res) => {
    fetchArticles().then((articles) => {
        res.status(200).send(articles);
    })
}


const getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) => {
        return article
    })
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        res.status(err.status || 500).send({msg: err.msg})
})
}

const getCommentsByArticleId = (req, res) => {
    const {article_id} = req.params;
    fetchCommentsByArticleId(article_id).then((comments) => {
        return comments;
    }).then((comments) => {
        res.status(200).send(comments);
    })
    .catch((err) => {
        res.status(err.status || 500).send({msg: err.msg})
})
}

module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId };
