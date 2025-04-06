let mongoose = require('mongoose');
let roleSchema = mongoose.Schema({
    roleName:{
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
module.exports = mongoose.model('Role',roleSchema)