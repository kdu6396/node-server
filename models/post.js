const mongoose = require('mongoose')
const Schema = mongoose.Schema
var config = require('../config')

const Post = new Schema({
    createTime : {type:Date,defalut:Date.now()},
    modifyTime : Date,
    title : String,
    content : String,
    views : {type:Number, default : 0},
    author : {type:Schema.Types.ObjectId , ref:'User'}
})

Post.statics.createPost = function(item, _id){
    const post = new this({
        modifyTime : Date.now(),
        title : item.title,
        content : item.content,
        author : _id
    })
    return post.save();
}

Post.statics.findAllPosts = function() {
    return this.find({}).populate('author');
}
module.exports = mongoose.model('Post', Post)