let mongoose = require('mongoose');
let roomTypeSchema = mongoose.Schema({
    typeName:{
        type:String,
        required:true,
        unique: [true, "Loại phòng đã tồn tại"]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('RoomType',roomTypeSchema)