const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const username = req.body.username;

    const user = await User.findOne({username: username});
    if (user) {
        return res.status(400).json({error: 'username already exists!'});
    }

    const newUser = new User({username, todoList: [{item: 'walk', date: '12-22-2002'}]});
    await newUser.save()
    .then(() => {
        res.json({userId: newUser._id, username: newUser.username});
    })
    .catch(e => res.json({error: `Server error: ${e}`}));
});

router.get('/login/:username', async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({username: username});

    if (!user) {
        return res.status(404).json({error: 'username doesn\'t exist!'})
    }

    res.json({userId: user._id, todoList: user.todoList});
});

module.exports = router;