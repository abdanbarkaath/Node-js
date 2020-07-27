const express = require('express');
const app = express();

//only calling it ensures that it runs
//calls the database to connect
require('./models/db');


const port = 3000;
app.set('view engine', 'ejs');


//gets the routes from the controller
var routes = require('./controllers/users');
//routes set in controller js
app.use('/', routes);
// app.use('/api/v1/', routes);

// Gets only the doctor routes
// app.use('/doctor/', doctorRoutes);

app.listen(port);
