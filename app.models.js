const db = require('./db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(
        (results) => {
            console.log(results.rows)
            return results.rows;
})
};

module.exports = { fetchTopics };