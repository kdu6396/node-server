const mongoose = require('mongoose')

const Comment = mongoose.Schema({
    username : String,
    content : String,    
    createtime : Date,
})


module.exports = mongoose.model('Comment', Comment);