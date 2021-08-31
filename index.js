const express = require('express');
const mongoose = require('mongoose');
const todohandeler = require('./route/todohandeler.js');
const userHandler = require('./route/userHandler')
const dotenv = require('dotenv');
const checklogin = require('./middleware/varify')

dotenv.config()

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/todo',
{ useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('Connection successfully'))
.catch((err) => console.log(err));

app.use('/todo', todohandeler);

app.use('/user', userHandler)

app.get('/', checklogin, (req, res) => {
    res.send(req.username + '\n' + req.userID + '\n' + 'siam');
});

app.listen(3000, () =>{
    console.log('server start successfully');
});