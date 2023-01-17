const { application } = require('express');
const express = require('express')
const app = express()
const { getTopics, getArticles, getArticleById } = require('./app.controllers')
app.use(express.json());


app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg}) 
        } else {
            next(err);
        }
    })

app.use((req, res, next) => {
    res.status(404).send({msg: 'Path Not Found'})
})


module.exports = app;