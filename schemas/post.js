let mongoose = require('mongoose');
const roomType = require('./roomType');
const PostCategory = require('./PostCategory');
let postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    area:{
        type:Number,
        required:true,
        min:0
    },
    city:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true
    },
    ward:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    rentPrice:{
        type:Number,
        required:true,
        min:0
    },
    deposit:{
        type:Number,
        required:true,
        min:0
    },
    expirationDate:{
        type:Date,
        required:true
    },
    approvalStatus: {
        type: Boolean,
        default: false 
    },
    serviceEndDate: {
        type: Date,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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
    roomType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RoomType',
        required:true
    },
    PostCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PostCategory',
        required:true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps:true
})
module.exports = mongoose.model('Post',postSchema)