var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

var User = require('../models/users')
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))



router.get('/', function (req, res) {
    res.render('home');
    User.find({ name: 'qadeer' }, (err, data) => {
        console.log(data);
    })
})

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/user/:id', function (req, res) {
    User.findOne({}, function (err, data) {
        res.render('user', { data: data });
    })
});

router.get('/profile', function (req, res) {
    res.render('profile');
});

router.post('/profile', (req, res) => {
    User.create({ name: req.body.name, age: req.body.age, height: req.body.height, }, (err, data) => {
        console.log(err, 'err');
        console.log(data, 'data');
    })
    console.log(req.body.age, 'req');
    res.render('profile');
});


module.exports = router;
