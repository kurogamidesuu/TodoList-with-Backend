const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/register', async (req, res) => {
    const { username, name, password } = req.body;

    const user = await User.findOne({username: username});
    if (user) {
        return res.status(400).json({error: 'username already exists!'});
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(400).json({error: 'internal server error!'});
            const newUser = await User.create({
                username,
                name,
                password: hash,
                todoList: []
            });

            let token = jwt.sign({username}, process.env.JWT_SECRET_KEY);
            res.cookie('token', token);

            res.json({userId: newUser._id, username, todoList: newUser.todoList});
        });
    });
});

router.post('/login/:username', async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    const user = await User.findOne({username: username});
    if (!user) {
        return res.status(404).json({error: 'username doesn\'t exist!'})
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(400).json({error: 'server error!'});

        if(result) {
            let token = jwt.sign({username: user.username, userId: user._id}, process.env.JWT_SECRET_KEY);
            res.cookie("token", token);
            res.json({userId: user._id, username: user.username, todoList: user.todoList});
        } else {
            return res.status(400).json({error: 'Wrong password!'});
        }
    });
});

router.get('/users/logout', (req, res) => {
    res.cookie('token', "");
    res.json();
});

module.exports = router;