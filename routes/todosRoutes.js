const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const jwt = require('jsonwebtoken');
const upload = require('../config/multerConfig.js');
const fs = require('fs');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies?.token;

    if(!token) {
        if (req.accepts('html')) {
            return res.redirect('/api/login?msg=login-required');
        } else {
            return res.status(401).json({ error: 'Please log in again!' });
        }
    } else {
        try {
            const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);

            if(req.params.username && req.params.username !== data.username) {
                return res.redirect('/api/login?msg=unauthorized-user');
            }

            req.user = data;
            next();
        } catch(err) {
            return res.redirect('/api/login?msg=invalid-token');
        }
    }
}

router.get('/users/:username/todos', isLoggedIn, async (req, res) => {
    const username = req.user.username;
    const user = await User.findOne({username: username});

    res.render('todos', {user: user});
});

router.post('/users/addtodo', isLoggedIn, async (req, res) => {
    try {
        const id = req.user.userId;
        const { item, date} = req.body;

        const user = await User.findById({_id: id});
        if (!user) return res.json({error: 'User not found'});

        user.todoList.push({item, date});
        await user.save();
        res.json(user.todoList);
    } catch(e) {
        res.json({error: 'error occurred'});
    }
});

router.get('/users/deletetodo', isLoggedIn, async (req, res) => {
    const id = req.user.userId;
    const index = req.query.index;

    const user = await User.findById({_id: id});
    if (!user) return res.json({error: 'User not found'});
    
    user.todoList.splice(index, 1);
    await user.save();

    res.json(user.todoList);
});

router.get('/users/swaptodo', isLoggedIn, async (req, res) => {
    const id = req.user.userId;
    const { index, direction } = req.query;

    if (!index || !direction) {
        return res.status(400).json({ error: 'Missing index or direction in query' });
    }

    const parsedIndex = parseInt(index);
    if (isNaN(parsedIndex)) {
        return res.status(400).json({error: 'Index must be a number'});
    }
    
    try {
        const user = await User.findById(id);
        if (!user) return res.json({error: 'User not found'});

        const todos = user.todoList;

        if (parsedIndex < 0 || parsedIndex >= todos.length) {
            return res.status(400).json({error: 'Invalid index'});
        }

        if (direction === 'up') {
            if (parsedIndex === 0) {
                return res.status(400).json({error: 'First element cannot be swapped up'});
            }
            [todos[parsedIndex], todos[parsedIndex-1]] = [todos[parsedIndex-1], todos[parsedIndex]];
        } else if (direction === 'down') {
            if (parsedIndex === todos.length-1) {
                return res.status(400).json({error: 'Last element cannot be swapped down'});
            }
            [todos[parsedIndex], todos[parsedIndex+1]] = [todos[parsedIndex+1], todos[parsedIndex]];
        } else {
            return res.status(400).json({error: 'Invalid direction'});
        }

        await user.save();
        res.json(user.todoList);
    } catch(e) {
        console.error(e);
        res.status(500).json({error: 'Internal server error'});
    }

});

router.post('/users/change-pfp', isLoggedIn, upload.single('pfp-image'), async (req, res) => {
    const id = req.user.userId;

    const user = await User.findById(id);
    if(!user) return res.status(400).json({error: 'User not found!'});

    if(!req.file) return res.status(400).json({error: 'Upload the file'});

    if(user.pfp !== 'default-pfp.png') {
        fs.unlinkSync(`./public/images/uploads/${user.pfp}`);
    }
    user.pfp = req.file.filename;
    
    await user.save();

    res.redirect(`/api/users/${user.username}/todos`);
});

module.exports = router;