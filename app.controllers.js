const {fetchTopics, fetchArticles} = require('./app.models');

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

module.exports = { getTopics, getArticles };