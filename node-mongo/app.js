const express = require('express');
const app = express();
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

/**
 * based on the path the routes will be rendered
 */
app.use('/admins/', routes);
app.use('/friends/', friends);
// app.use('/', {...routes, ...friends});
// app.use('/api/v1/', routes);

// Gets only the doctor routes
// app.use('/doctor/', doctorRoutes);

app.listen(port);
