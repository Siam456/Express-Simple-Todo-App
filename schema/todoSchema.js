const express = require('express');
const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    status: {
        type: String,
        enum: ["active" , "inactive"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
})


//instance methods
todoSchema.methods = {
    findActive: function()  {
        return mongoose.model("Todo").find({status: "active"})
    },
    findActivecb: (cb) => {
        return mongoose.model("Todo").find({status: "active"}, cb)
    }
};

//static methods
todoSchema.statics = {
    findByJs: function() {
        return this.find({title:"Hello from siam"})
    }
}

//query helpers

todoSchema.query = {
    ByJs: function(language) {
        return this.find({title: new RegExp(language, "i")})
    }
}

module.exports = todoSchema;