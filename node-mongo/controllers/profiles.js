var express = require('express');
var router = express.Router();

const Profile = require('../models/profile');

/**
 * Gets the list of profiles
 */
router.get('/', async (req, res) => {
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
        const user = await Profile.findByCredentials(req.body.name, req.body.password);
        console.log(user, 'waiting');
        res.send(user);
    }
    catch (e) {
        res.send(e)
    }
})


module.exports = router;

