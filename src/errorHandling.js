const path = require('path');
const notFoundHandler = (req, res, next) => res.status(404).sendFile(path.join(__dirname, 'error.html'));
const serverErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'error.html'));
};
module.exports = { notFoundHandler, serverErrorHandler };