const express = require('express')
const app = express()
const { getTopics, getArticles } = require('./app.controllers')
app.use(express.json());


app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

module.exports = app;