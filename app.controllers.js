const {fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addNewComment, updateVotes, fetchUsers, fetchTopicsByName, removeComment, fetchCommentsByCommentId} = require('./app.models');


const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics);
    }).catch(err => {
        next(err);
    })
    }

const getArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query;
    if (topic) {
        fetchTopicsByName(topic).then(() => {
            fetchArticles(topic, sort_by, order).then((articles) => {
                res.status(200).send({articles})
            })
        }).catch(err => {
            next(err);
        })
    } else {
        fetchArticles(topic, sort_by, order).then((articles) => {
            res.status(200).send({articles});
        }).catch(err => {
            next(err);
        })
    }
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
};

const deleteCommentsByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    fetchCommentsByCommentId(comment_id).then(() => {
        removeComment(comment_id).then((comment) => {
            res.status(204).send(comment)
        })
    }).catch(err => {
        next(err)
    })
}
    


module.exports = { getTopics, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchVotesbyArticleId, getUsers, deleteCommentsByCommentId };
