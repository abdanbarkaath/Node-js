var mongoose = require('mongoose');
var validator = require('validator');


/**
 * call the database from the db 
 * mongo is not connected until the data base is not called
 */
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate(value) {
            if (validator.isEmpty(value)){
                throw new Error('enter a valid name')
                console.log('invalid here');
            }
        }
    },
    age: {
        type: String,
        required: false,
    },
    height: String,
});

//pluralises it and converts to lower case
var userModel = mongoose.model('Admin', userSchema);

module.exports = userModel;