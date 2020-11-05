var mongoose = require('mongoose');
var validator = require('validator')

var friendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate(value) {
            if (validator.isEmpty(value)) {
                throw new Error('user name is empty');
            }
        }
    },
    age: {
        type: String,
        required: true,
    }
})

var friend = mongoose.model('Friend', friendSchema);

module.exports = friend;