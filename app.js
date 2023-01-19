const express = require('express')
const app = express()

const { getTopics, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchVotesbyArticleId, getUsers } = require('./app.controllers')

app.use(express.json());
const {incorrectPath, customErrors, serverErrors, psqlErrorCodes} = require('./errorHandling')

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchVotesbyArticleId)

app.get('/api/users', getUsers)

app.use(incorrectPath);
app.use(customErrors);
app.use(psqlErrorCodes);
app.use(serverErrors);

module.exports = app;