const express = require('express')
const app = express()
const { getTopics, getArticles, getArticleById, getCommentsByArticleId } = require('./app.controllers')
app.use(express.json());


app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)


app.use((req, res, next) => {
    res.status(404).send({msg: 'Path Not Found'})
})

app.use((err, req, res, next) => {
if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg}) 
    } 
     next(err);
})

app.use((err, req, res, next) => {
    res.status(500).send('Internal Server Error');
})

module.exports = app;