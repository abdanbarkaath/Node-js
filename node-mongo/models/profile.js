var mongoose = require('mongoose');
var validator = require('validator')
var bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

var profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate(value) {
            if (validator.isEmpty(value)) {
                throw new Error('user name is empty');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (validator.isByteLength(value)) {
                throw new Error('Password is empty');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})


/**
 * Set connection between task and profiles with some keys
 */
profileSchema.virtual('tasks', {
    ref: "Task", //With whom the connection is set to be established
    localField: "_id", //Used to identify using this specific key
    foreignField: "owner" //What key are we using from the tasks data base to establish a connection

})

/**
 * toJSON automatically removes the tokens
 */
// profileSchema.methods.toJSON = function () {
//     const userObj = this.toObject();
//     delete userObj.tokens;
//     delete userObj.password;
//     return userObj;
// };


// for login 

profileSchema.methods.comparePassword = function (password, cb) {
    // Compare the input password with stored hash password in dB.
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    });
};

//general method to generate auth token

profileSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, 'profileLogin', { expiresIn: '3h' });
        this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (e) {
        console.log(e);
    }
};

// for login 

profileSchema.statics.findByCredentials = async (name, password) => {
    const user = await Profile.findOne({ name });
    if (!user) {
        throw new Error('unable to login');
    }
    const isMatch = await bycript.compare(password, user.password);
    if (!isMatch) {
        throw new Error('invalid password');
    }
    return user;
}

//middleware to convert password to hash
profileSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bycript.hash(this.password, 8);
    }
})
//middleware to convert remove all the task related to this profile
profileSchema.pre('findOneAndDelete', async function () {
    console.log('this got');
    // await Task.deleteMany({ owner: this._id })
    next();
})

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
