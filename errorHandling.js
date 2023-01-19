const incorrectPath = ('/*', (req, res) => {
    res.status(404).send({msg: 'Path Not Found'})
})

const psqlErrorCodes = (err, req, res, next) => {
    console.log(err, '<---- test')
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid data type'}) 
    } else {
        if (err.code === '23503') {
            res.status(400).send({msg: 'Username does not exist'})
    } else {
        if (err.code === '23502') {
            res.status(400).send({msg: 'Required field(s) empty'})
            }
        }
    }
}

const customErrors = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg}) 
        } else {
            next(err);
        }
    }

const serverErrors = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

module.exports = {incorrectPath, customErrors, psqlErrorCodes, serverErrors}