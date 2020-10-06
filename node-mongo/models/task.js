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
    }
})

var task = mongoose.model('Task', taskSchema);

module.exports = task;