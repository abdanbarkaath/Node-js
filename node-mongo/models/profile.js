var mongoose = require('mongoose');
var validator = require('validator')
var bycript = require('bcrypt');

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
    }
})

// for login 

profileSchema.statics.findByCredentials = async (name, password) => {
    const user = await Profile.find({ name });
    if(!user) {
        throw new Error ('unable to login');
    }

    const isMatch = await bycript.compare(password, user.password);

    if(!isMatch){
        throw new Error('invalid password');
    }
    return user;
}

//middleware to convert password to hash
profileSchema.pre('save', async function () {
    if (this.isModified('password')) { 
        this.password = await bycript.hash(this.password, 8);
    }
    next();
})

var profile = mongoose.model('Profile', profileSchema);

module.exports = profile;