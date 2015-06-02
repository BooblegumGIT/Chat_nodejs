var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Main page'});
});
router.get('/socket', function (req, res, next) {
    res.render('socket_demo', {});
});
router.get('/chat', function (req, res, next) {
    res.render('chat', {});
});
router.get('/about', function (req, res, next) {
    res.render('about', {});
});

module.exports = router;
