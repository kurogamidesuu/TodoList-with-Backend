const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');

router.get('/users/todos', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'todos.html'));
});

router.post('/users/:id/addtodo', async (req, res) => {
    try {
        const { id } = req.params;
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

router.get('/users/:id/deletetodo', async (req, res) => {
    const { id } = req.params;
    const index = req.query.index;

    const user = await User.findById({_id: id});
    if (!user) return res.json({error: 'User not found'});
    
    user.todoList.splice(index, 1);
    await user.save();

    res.json(user.todoList);
});

router.get('/users/:id/swaptodo', async (req, res) => {
    const { id } = req.params;
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

module.exports = router;