let mongoose = require('mongoose');
let serviceSchema = mongoose.Schema({
    serviceName:{
        type:String,
        required:true,
        unique: [true, "Dịch vụ đã tồn tại"]
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('Services',serviceSchema)