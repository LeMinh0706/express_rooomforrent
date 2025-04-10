let mongoose = require('mongoose');
let postCategorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique: [true, "Loại bài đăng đã tồn tại"]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('PostCategory',postCategorySchema)