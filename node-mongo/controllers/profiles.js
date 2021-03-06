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
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find({})
        if (profile) {
            res.status(201).send(profile);
        } else {
            res.status(404).send({ message: "No profile found" })
        }
        // Profile.find({}).then((data) => {
        //     res.send(data)
        // }).catch((err) => {
        //     res.send(err);
        // });


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
 * Using auth middleware so that only verified user can delete 
 */
router.delete('/removeprofile/me', auth, async (req, res) => {
    try {
        //  await req.profile.remove();
        // const profile = await Profile.findByIdAndDelete({ _id: req.profile._id })
        const id = req.profile._id.toString();
        const profile = await Profile.findOneAndDelete({ _id: req.profile._id })
        console.log(profile);
        if (profile) {
            res.send({ message: 'profile removed successfully' })
        } else {
            res.send({ message: 'some error occured' })
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

router.patch('/updateprofile/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'password'];
    const isValid = updates.every((update) => allowUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send({ error: 'invalid params' });
    }
    try {
        //You get the profile same as the modal name that you have defined in the req params
        console.log(req.profile);
        updates.forEach((update) => req.profile[update] = req.body[update]);
        await req.profile.save();
        return res.status(200).send({ message: 'Password updated' });
    } catch (error) {
        res.send(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await Profile.findByCredentials(req.body.name, req.body.password);
        //comares the current string code with the users hash code
        // const isMatch = await bycript.compare(req.body.password, user.password);
        // res.status(200).send({ user, token })
        user.generateAuthToken()
            .then((token) => {
                res.status(200).send({ user, token })
            }).catch((e) => {
                console.log(e);
            })
        // if (!isMatch) {
        //     throw new Error('invalid password');
        // }
    }
    catch (e) {
        res.send(e.message);
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        console.log(req);
        req.profile.tokens = req.profile.tokens.filter((user) => user.token !== req.token)
        await req.profile.save();
        res.send(req.profile.tokens)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.post('/logoutall', auth, async (req, res) => {
    try {
        req.profile.tokens = [];
        await req.profile.save();
        res.send(req.profile.tokens)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router;

