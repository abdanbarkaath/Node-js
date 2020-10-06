const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');

const auth = async (req, res, next) => {
    try {
        //finds the header and gets back the header value
        const token = await req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, 'profileLogin');
        const profile = await Profile.findOne({ _id: decode });
        if (!profile) {
            throw new Error('no such profile found')
        }
        //stores the profile for later use like vuex
        req.token = token;
        req.profile = profile;
        next();
    } catch (e) {
        res.send({error :'please login'});
    }
}
module.exports = auth;