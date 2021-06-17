module.exports = function (err, req, res, next) {
    //Error 500: Internal server error
    res.status(500).send('Something Failed');
}