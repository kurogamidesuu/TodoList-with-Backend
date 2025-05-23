const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todosRoutes');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/api/login');
});

app.use('/api', userRoutes);
app.use('/api', todoRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully!'))
.catch(e => console.error('Mongo error: ', e));

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('The server is listening on port ' + listener.address().port)
});