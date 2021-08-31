const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checklogin = require('../middleware/varify')

const todoSchema = require('../schema/todoSchema');
const todo = new mongoose.model("Todo", todoSchema);

const userSchema = require('../schema/userSchema');
const User = new mongoose.model("User", userSchema);



const todohandeler = (req, res) => {
    res.send('siahsjbn');
}

router.get('/js', async (req, res) => {
    const data = await todo.findByJs();
    res.status(200).json({
        data,
    })
})

router.get('/lan', async (req, res) => {
    const data = await todo.find().ByJs("siam");
    res.status(200).json({
        data,
    })
})

router.get('/active', async (req, res) =>{
    const todoq = new todo();
    const data = await todoq.findActive();
    res.status(200).json({
        data: data
    })
});


router.get('/activecall', (req, res) =>{
    const todoq = new todo();
    todoq.findActivecb((err, data) => {
        res.status(200).json({
            data: data
        })
    })
})


router.get('/', checklogin, (req, res) => {
     todo.find({status : "active"})
     .populate("user" , "status username -_id")
    .select({
        
    })
    .limit()
    .exec((err, data) => {
        if(err) {
            res.status(500).json({
                error: err,
            })
        }
        else{
            res.status(200).json({
                result: data,
                message: "data showed success",
            })
        }
    })
});

router.get('/:id', async (req, res) => {
     const data = await todo.find({_id: req.params.id});
     try{
        res.status(200).json({
            result: data,
            message : "search by id successfull"
        })
     }
     catch{
        res.status(500).json({
            error: "error"
        })
     }
     
    
})


router.post('/', checklogin, async  (req, res) => {
    const newTodo = new todo({
        ...req.body,
        user: req.userID
    });
    try{
        const t = await newTodo.save();
        await User.updateOne({
        _id : req.userID,
        } , {
            $push: {
                todos: t._id
            }
        });

        res.status(200).json({
            message: "success",
        })
    } catch{
        res.status(500).json({
            error: "error",
        })
    }
});

router.post('/all', (req, res) => {
    
     todo.insertMany(req.body, (err) => {
        if(err) {
            res.status(500).json({
                error: "error",
            })
        }
        else{
            res.status(200).json({
                message: "success",
            })
        }
    }) 
});

router.put('/:id', (req, res) => {
    
     todo.updateOne({_id: req.params.id},
       {
           $set: {
               status: "inactive",
           },
       },
        (err) => {
        if(err) {
            res.status(500).json({
                error: "error",
            })
        }
        else{
            res.status(200).json({
                message: "success",
            })
        }
    }) 
});

//update all status 


router.delete('/:id' , (req, res) => {
     todo.deleteOne({_id : req.params.id}, (err) =>{
        if(err){
            res.status(500).json({
                error: "have an error"
            })
        } else{
            res.status(200).json({
                message: "delete successfully"
            })
        }
    })
})

module.exports = router;