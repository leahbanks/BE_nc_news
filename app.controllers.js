const {fetchTopics, fetchArticles, fetchArticleById} = require('./app.models');

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
    .catch(next);
}

module.exports = { getTopics, getArticles, getArticleById };