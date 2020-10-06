var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST

const Tasks = require('../models/task')

router.get('/', async (req, res) => {
    try {
        Tasks.find({}).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err);
        });

    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        Tasks.findById({ _id: req.params.id }).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err);
        });

    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

router.post('/AddTask', (req, res) => {
    try {
        const task = new Tasks(req.body)
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


router.delete('/RemoveTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id })
        res.status(200).send({ message: 'task Removed successfully' });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

router.patch('/UpdateTask/:id', async (req, res) => {
    try {
        const task = await Tasks.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({ message: 'task updated successfully' });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

module.exports = router