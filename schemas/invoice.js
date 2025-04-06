let mongoose = require('mongoose');
let invoiceSchema = mongoose.Schema({
    totalPrice:{
        type:Number,
        required:true,
        min:0
    },
    content:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Services',
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
module.exports = mongoose.model('Invoice',invoiceSchema)