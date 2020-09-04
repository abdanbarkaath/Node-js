const express = require('express');
const app = express();

//encrypting the input value
const bcrypt = require('bcrypt');
const saltRounds = 8; // number of rounds to be performed

//jwt
const jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');
//converts url code to json format
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//only calling it ensures that it runs
//calls the database to connect
require('./controllers/db');

const port = 3000;
app.set('view engine', 'ejs');


//gets the routes from the controller
var routes = require('./controllers/users');
var friends = require('./controllers/friends');
var profiles = require('./controllers/profiles');

/**
 * based on the path the routes will be rendered
 */
app.use('/admins/', routes);
app.use('/friends/', friends);
app.use('/profiles/', profiles);
// app.use('/', {...routes, ...friends});
// app.use('/api/v1/', routes);

// Gets only the doctor routes
// app.use('/doctor/', doctorRoutes);

app.listen(port);
