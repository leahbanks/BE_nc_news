const { fetchTopics } = require('./app.models');

const getTopics = (req, res) => {
    fetchTopics().then((response) => {
        res.status(200).send(response)
    })
}

module.exports = { getTopics };