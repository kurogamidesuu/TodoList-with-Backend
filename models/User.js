const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    todoList: [todoSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;