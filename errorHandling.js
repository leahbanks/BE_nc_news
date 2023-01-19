const incorrectPath = ('/*', (req, res) => {
    res.status(404).send({msg: 'Path Not Found'})
})

const customErrors = (err, req, res, next) => {
if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg}) 
    } else {
        next(err);
    }
}

const psqlErrorCodes = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Article ID must be a number'}) 
    } else {
        if (err.code === '23503') {
            res.status(400).send({msg: 'Username does not exist'})
            
        }
    }
}

const serverErrors = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

module.exports = {incorrectPath, customErrors, psqlErrorCodes, serverErrors}