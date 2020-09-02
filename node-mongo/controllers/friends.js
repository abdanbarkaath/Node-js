var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

// //converts url code to json format
// router.use(bodyParser.urlencoded({ extended: false }))
// router.use(bodyParser.json());

const Friends = require('../models/friend');

/**
 * Gets the list of friends
 */
router.get('/', async (req, res) => {
    try {
         Friends.find({}).then((data) => {
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
router.post('/addfriend', async (req, res) => {
    try {
        /**
         * Searches if there any existing user
         * if not then adds the friends
         */
        req.body.name = req.body.name.toLowerCase()
        const friendFound = await Friends.findOne({ name: req.body.name });
        if (friendFound) {
            res.send({ message: 'user already exits' })
        } else {
            const friends = new Friends(req.body);
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
router.delete('/removefriend/:name', async (req, res) => {
    try {
        req.params.name = req.params.name.toLowerCase()
        const friendFound = await Friends.findOneAndDelete({ name: req.params.name });
        console.log(friendFound);
        if (friendFound) {
            res.send({ message: 'user Removed successfully' })
        } else {
            res.send({ message: 'No such user found' });
        }
    } catch (error) {
        res.send(error)
    }
});


module.exports = router;

