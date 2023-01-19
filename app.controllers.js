
const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addNewComment} = require('./app.models');

const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics);
    });
    }

const getArticles = (req, res, next) => {
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
    }).catch(err => {
        next(err);
    });
}

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;

    fetchArticleById(article_id).catch(next);

    fetchCommentsByArticleId(article_id).then((comments) => {
        return comments;
    }).then((comments) => {
        res.status(200).send(comments);
    }).catch(err => {
        next(err);
    })
}

const postCommentByArticleId = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params;
    
    fetchArticleById(article_id).catch(next);
        
    addNewComment(newComment, article_id).then((comment) => {
        res.status(201).send(comment);
    }).catch(err => {
        next(err);
    })
}


module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId };
