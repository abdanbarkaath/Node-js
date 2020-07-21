var mongoose = require('mongoose');
/**
 * call the database from the db 
 * mongo is not connected until the data base is not called
 */
var userSchema = new mongoose.Schema({
    name: String,
    age: String,
    height: String,
});

var userModel = mongoose.model('admin', userSchema);

module.exports = userModel;