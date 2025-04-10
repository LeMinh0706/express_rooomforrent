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
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps:true
})
module.exports = mongoose.model('Review',reviewSchema)