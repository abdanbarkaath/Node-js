var mongoose = require('mongoose');
var validator = require('validator')

var taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile', //Same name as in the profile modal schema
    }
})

var task = mongoose.model('Task', taskSchema);

module.exports = task;