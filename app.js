const express = require('express')
const app = express()
const { getTopics } = require('./app.controllers')


app.get('/api/topics', getTopics);

module.exports = app;