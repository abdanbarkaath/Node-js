var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

var User = require('../models/user')
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

//json parser
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render('home');
    User.find({ name: 'qadeer' }, (err, data) => {
        console.log(data);
    })
})

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/user/:name', function (req, res) {
    User.findOne({ name: req.params.name }, function (err, data) {
        res.render('user', { data: data });
    })
});

router.get('/profile', function (req, res) {
    res.render('profile');
});

// router.post('/profile', (req, res) => {
//     User.create({ name: req.body.name, age: req.body.age, height: req.       .height, }, (err, data) => {
//         console.log(err, 'err');
//         console.log(data, 'data');
//     })
// });

/**
 * alternative to user.create();
 */
router.post('/profile', (req, res) => {
    const user = new User(req.body);
    user.save().then((info) => {
        res.send(info);
    }).catch((err) => {
        res.send(err);
    })
});


module.exports = router;
