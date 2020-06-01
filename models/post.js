const mongoose = require('mongoose')
const Schema = mongoose.Schema
var config = require('../config')
const Count = require('./count')

const Post = new Schema({
    postid : {type:Number, required : true},
    createTime : {type:Date,defalut:Date.now},
    modifyTime : Date,
    title : String,
    content : String,
    views : {type:Number, default : 0},
    author : {type:Schema.Types.ObjectId , ref:'User'}
})

Post.statics.createPost = function(item, _id){
    const post = new this({
        postid : item.postid,
        createTime : Date.now(),
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

Post.statics.deletePost = function(postid) {
    return this.deleteOne({postid});
}

Post.statics.updatePost = function({postid, title, content}){
    return this.updateOne(
        {postid},
        {"$set" : {title, content, modifyTime:Date.now()}}
    );
}

module.exports = mongoose.model('Post', Post)