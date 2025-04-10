let mongoose = require('mongoose');
const roomType = require('./roomType');
const PostCategory = require('./PostCategory');
let postSchema = mongoose.Schema({
    title:{
        type:String,
        required: [true, "Tiêu đề không được để trống"],
    },
    area:{
        type:Number,
        required: [true, "Diện tích không được để trống"],
        min: [1, "Diện tích phải lớn hơn 0"]
    },
    city:{
        type:String,
        required: [true, "Thành phố không được để trống"],
    },
    district:{
        type:String,
        required: [true, "Quận huyện không được để trống"],
    },
    ward:{
        type:String,
        required: [true, "Phường xã không được để trống"],
    },
    address:{
        type:String,
        required: [true, "Địa chỉ không được để trống"],
    },
    description:{
        type:String,
        required: [true, "Mô tả không được để trống"],
    },
    rentPrice:{
        type:Number,
        required: [true, "Giá thuê không được để trống"],
        min: [0, "Giá thuê phải lớn hơn 0"]
    },
    deposit:{
        type:Number,
        required: [true, "Tiền cọc không được để trống"],
        min: [0, "Tiền cọc phải lớn hơn 0"]
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
        required: [true, "Vĩ độ không được để trống"],
    },
    longitude: {
        type: Number,
        required: [true, "Kinh độ không được để trống"],
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    imageProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostImages', 
        required: true
    }],
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
    postCategory:{
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