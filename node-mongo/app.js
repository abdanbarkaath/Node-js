const express = require('express')
const app = express()

const port = 3000;

app.set('view engine', 'ejs');
//calls the database to connect
var db = require('./models/db');

//gets the routes from the controller
var routes = require('./controllers/users');
//routes set in controller js
app.use('/', routes);

app.listen(port)
