

const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addNewComment, updateVotes, fetchUsers} = require('./app.models');


const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics);
    }).catch(err => {
        next(err);
    })
    }

const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send(articles);
    }).catch(err => {
        next(err);
    })
    }

const getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    }).catch(err => {
        next(err);
    });
}

const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    fetchCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send(comments);
    }).catch(err => {
        next(err);
    })
}

const postCommentByArticleId = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params;
    
    addNewComment(newComment, article_id).then((comment) => {
        res.status(201).send(comment);
    }).catch(err => {
        next(err);
    })
}


const patchVotesbyArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const increaseVotes = req.body

  updateVotes(increaseVotes, article_id).then((updatedVotes) => {
        res.status(200).send(updatedVotes)
    }).catch(err => {
        next(err);
    })
}


const getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send(users)
    }).catch(err => {
        next(err)
    })
}
    


module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchVotesbyArticleId, getUsers };
