const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../schema/userSchema');

const User = new mongoose.model("User", userSchema);

const route = express.Router();

route.get('/', (req, res) => {
    res.send('sokm');
})

route.post('/singup', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashpass= await bcrypt.hash(req.body.password, salt);
        console.log(hashpass)
        const user = new User({
            user: req.body.name,
            username: req.body.username,
            password: hashpass,
            status: req.body.status,
        })
    
        await user.save();
        res.status(200).json({
            Message: "Singup Successfully"
        })
    } catch{
        res.status(500).json({
            Error: "Singup Failed"
        })
    }
});

route.post('/login', async (req, res) => {
    try{
        const user = await User.find({username: req.body.username});
        if(user && user.length > 0){
            const isvalidpass = await bcrypt.compare(req.body.password, user[0].password);
            if(isvalidpass){
                const token = jwt.sign({
                    username: user[0].username,
                    userID: user[0]._id,
                }, process.env.JWT_SECRATE, {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    token: token,
                    Message: "Login Successfull"
                })
            }else{
                res.status(401).json({
                    Error: "Authentication failed"
                })
            }

        } else{
            res.status(401).json({
                Error: "Authentication failed"
            })
        }
    } catch{
        res.status(401).json({
            Error: "Authentication failed"
        })
    }
});

route.get('/all', async (req, res) => {
    try{
        const siam = await User.find({status : "Inactive"})
        .populate("todos");
            
        res.status(200).json({
            data: siam,
            Message: "data get successfully"
        })
    } catch{
        res.status(500).json({
            Error: "Error"
        })
    }
})

module.exports = route;