var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

//gets css files
app.set('view engine', 'ejs');
//if profile/somthing then the middleware is run
app.use('/assets', express.static('assets'));
app.use('/profile', (req, res, next) => {
    console.log("middleware");
    next();
})
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.render('home');
})

//send object
app.get("/contact", (req, res) => {
    var a = {
        number: "9700628128"
    }
    res.send(a);
})
//queries
app.get('/profile', (req, res) => {
    console.log(req.query);
    res.render('profile', { query: req.query })
})
// post method

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', urlencodedParser, (req, res) => {
    console.log(req.body);
    res.render('login-success', { data: req.body })
})

//send data 
app.get('/user/:name', (req, res) => {
    var data = {
        age: 21,
        height: 5.6
    }
    console.log("After Middleware");
    res.render('user', { user: req.params.name, data: data })
})

app.listen(3000)