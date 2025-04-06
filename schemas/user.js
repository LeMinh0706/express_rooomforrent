let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    avatar:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
        required:true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
    timestamps:true
})
module.exports = mongoose.model('User',userSchema)