const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
var config = require('./config')

const Commen = new Scheam({
    username : String,
    content : String,    
    createtime : Date,
})

const Board = new Schema({
    createTime : Date,
    modifyTime : Date,
    title : String,
    content : String,
    comments : [Commen]
})

const User = new Schema({
    username: String,
    password: String,
    admin: { type: Boolean, default: false },
    board : [Board]
})

// create new User document
User.statics.create = function(username, password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(password)
                    .digest('base64')

  const user = new this({
      username,
      password: encrypted
  })

  // return the Promise
  return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function(username) {
    return this.findOne({
        username
    }).exec()
}
User.statics.postPost = function(body){
    const {username, title, content} = body;
    return this.updateOne({username},{$push:{"data" : {title,content}}});
}
// verify the password of the User documment
User.methods.verify = function(password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(password)
                    .digest('base64')

  return this.password === encrypted
}

User.methods.assignAdmin = function() {
    this.admin = true
    return this.save()
}


module.exports = mongoose.model('User', User)