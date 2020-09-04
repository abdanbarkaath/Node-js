var mongoose = require('mongoose');
var validator = require('validator')
var bycript = require('bcrypt');
const jwt = require('jsonwebtoken');


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

// for login 

profileSchema.methods.comparePassword = function comparePassword(passwrd, cb) {
    // Compare the input password with stored hash password in dB.
    bcrypt.compare(passwrd, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    });
};

//general method to generate auth token

profileSchema.methods.generateAuthToken = async function generateAuthToken() {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, 'profileLogin');
        this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (e) {
        console.log(e);
    }
};

//middleware to convert password to hash
profileSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bycript.hash(this.password, 8);
    }
})

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
