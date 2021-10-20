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
        default:false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile', //Same name as in the profile modal schema
    }
},{
    timestamps:true,
})

var task = mongoose.model('Task', taskSchema);

module.exports = task;