let mongoose = require('mongoose');
let postCategorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('PostCategory',postCategorySchema)