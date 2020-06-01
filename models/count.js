const mongoose = require('mongoose')
const Schema = mongoose.Schema
var config = require('../config')
mongoose.set('useFindAndModify', false);
const Count = new Schema({
    name : String,
    lastNum : {type : Number, default : 0}
})

Count.statics.getNextNum = function(name){
    //const targetCount = this.updateOne( {name}, {$inc :{lastNum:1} }, {upsert : true});
    return this.findOneAndUpdate( {name}, {$inc :{lastNum:1} },{upsert:true,new:true});
}
module.exports = mongoose.model('Count', Count)