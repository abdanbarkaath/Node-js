var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const { update } = require('../models/task');

const Tasks = require('../models/task')

router.get('/', auth, async (req, res) => {
    try {
        //Appends the tasks array to the profile object
        //gets tasks specific to the login or id 
        const profileTask = await req.profile.populate('tasks').execPopulate();
        if (profileTask) {
            console.log(profileTask.tasks);
            res.status(201).send(profileTask.tasks);
        } else {
            res.status(404).send({ message: "No tasks found" })
        }

        //gets all the tasks in the database
        // const task = await Tasks.find({});
        // await task.populate('owner').execPopulate();
        // if (task) {
        //     res.status(201).send(task);
        // } else {
        //     res.status(404).send({ message: "No tasks found" })
        // }

    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        // Gets the task id from the link and the profile id from the auth that we are setting
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.profile._id });
        if (task) {
            res.status(200).send(task)
        } else {
            res.status(404).send({ message: "No tasks found" })
        }
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.post('/AddTask', auth, (req, res) => {
    try {
        const task = new Tasks({
            ...req.body,
            owner: req.profile._id,
        })
        task.save()
            .then((info) => {
                res.status(201).send(info);
            })
            .catch((err) => {
                res.send(err);
                console.info(err);
            })
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});


router.delete('/RemoveTask/:id', auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.profile._id })
        if (!task) {
            res.status(200).send({ message: 'no task found' });
        }
        res.status(200).send({ message: 'task Removed successfully' });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

router.patch('/UpdateTask/:id', auth, async (req, res) => {
    try {
        const objectValues = Object.keys(req.body)
        const allowUpdates = ['description', 'completed'];
        const isValid = objectValues.every((update) => allowUpdates.includes(update));
        if (!isValid) {
            return res.status(400).send({ error: 'invalid params' });
        }
        //Gets the task object by params and user id 
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.profile._id });
        if (!task) {
            res.status(400).send({ message: 'no task found' });
        }
        //loops through the object and updates the object
        objectValues.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
        // updates.forEach((update) => req.profile[update] = req.body[update]);
        // await req.profile.save();
        // return res.status(200).send({ message: 'Password updated' });
        // if(isValid){
        //     const task = await Tasks.findByIdAndUpdate(req.params.id, req.body);
        // }else{
        //     res.status(400).send({ message: 'invalid params' });

        // }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

module.exports = router