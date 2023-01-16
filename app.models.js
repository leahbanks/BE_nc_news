const db = require('./db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(
        (results) => {
            return results.rows;
})
};

module.exports = { fetchTopics };