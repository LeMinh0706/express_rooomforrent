let mongoose = require('mongoose');
const user = require('./user');
let reviewSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
},{
    timestamps:true
})
module.exports = mongoose.model('Review',reviewSchema)