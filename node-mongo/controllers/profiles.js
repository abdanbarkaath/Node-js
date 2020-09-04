var express = require('express');
var router = express.Router();
var bycript = require('bcrypt');
//import middleware
const auth = require('../middleware/auth');

const Profile = require('../models/profile');

/**
 * Gets the list of profiles
 * imports and adds the middleware
 * suppose there is a  list of task by all the people then with auth middleware we will be able to show only those task which are available to the user
 * /games will only list out the games of this particular user and not all the games of different users 
 */
router.get('/', auth, async (req, res) => {
    try {
        Profile.find({}).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err);
        });

    } catch (error) {
        res.send(error);
        console.log(error);
    }
});
/**
 * suppose there is a  list of task by all the people then with auth middleware we will be able to show only those task which are available to the user
 * /games will only list out the games of this particular user and not all the games of different users 
 * This will only work if we have the header
 * so we get the id from the header and we use the middleware to check if user is logged in and if yes then show the user profile
 */
router.get('/me', auth, async (req, res) => {
    try {
        if (req.profile) {
            res.send(req.profile);
        } else {
            res.status(400).send('Please login')
        }
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

/**
 * Add friend to list 
 * Also check if the user already exits
 */
router.post('/addprofile', async (req, res) => {
    try {
        /**
         * Searches if there any existing user
         * if not then adds the friends
         */
        req.body.name = req.body.name.toLowerCase()
        const profileFound = await Profile.findOne({ name: req.body.name });
        if (profileFound) {
            res.send({ message: 'profile already exits' })
        } else {
            const friends = new Profile(req.body);
            friends.save()
                .then((info) => {
                    res.status(201).send(info);
                })
                .catch((err) => {
                    res.send(err);
                    console.info(err);
                })
        }
    } catch (error) {
        res.send(error)
    }
});

/**
 * Searches and removes the specific User
 */
router.delete('/removeprofile/:name', async (req, res) => {
    try {
        req.params.name = req.params.name.toLowerCase()
        const profileFound = await Profile.findOneAndDelete({ name: req.params.name });
        console.log(profileFound);
        if (profileFound) {
            res.send({ message: 'profile removed successfully' })
        } else {
            res.send({ message: 'No such user found' });
        }
    } catch (error) {
        res.send(error)
    }
});

router.patch('/updateprofile', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'password'];
    const isValid = updates.every((update) => allowUpdates.includes(update));
    if (isValid) {
        return res.status(400).send({ error: 'invalid params' });
    }
    try {
        /**
         * Searches if there any existing user
         * if not then adds the friends
         */
        req.body.name = req.body.name.toLowerCase()
        const profileFound = await Profile.findOne({ name: req.body.name });
        if (profileFound) {
            res.send({ message: 'profile already exits' })
        } else {
            const friends = new Profile(req.body);
            friends.save()
                .then((info) => {
                    res.status(201).send(info);
                })
                .catch((err) => {
                    res.send(err);
                    console.info(err);
                })
        }
    } catch (error) {
        res.send(error)
    }
});

router.patch('/updateprofile/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'password'];
    const isValid = updates.every((update) => allowUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send({ error: 'invalid params' });
    }
    try {
        const user = await Profile.findById(req.params.id).exec();
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        if (!user) {
            res.status(400).send({ message: 'no such user exists' })
        } else {
            res.status(200).send({ message: 'profile updated successfully' })
        }
    } catch (error) {
        res.send(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await Profile.findOne({ name: req.body.name });
        if (!user) {
            throw new Error('unable to login');
        }
        //comares the current string code with the users hash code
        const isMatch = await bycript.compare(req.body.password, user.password);
        // const token = await user.generateAuthToken();
        // res.status(200).send({ user, token })
        user.generateAuthToken()
            .then((token) => {
                res.status(200).send({ user, token })
            }).catch((e) => {
                console.log(e);
            })
        if (!isMatch) {
            throw new Error('invalid password');
        }
    }
    catch (e) {
        res.send(e.message);
    }
})


module.exports = router;

