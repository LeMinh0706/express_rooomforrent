let mongoose = require('mongoose');
let postImagesSchema = mongoose.Schema({
    urlImage:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})
module.exports = mongoose.model('PostImages',postImagesSchema)