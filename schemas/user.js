let mongoose = require('mongoose');
let bcrypt = require('bcrypt')
let userSchema = mongoose.Schema({
    avatar:{
        type:String,
    },
    userName:{
        type:String,
        required: [true, "userName khong duoc de trong"],
        unique: [true, "username da ton tai"]
    },
    phoneNumber:{
        type:String,
        required: [true, "phoneNumber khong duoc de trong"],
        unique: [true, "phoneNumber da ton tai"]
    },
    password:{
        type:String,
        required: [true, "password khong duoc de trong"],
    },
    email:{
        type:String,
        required: [true, "email khong duoc de trong"],
        unique: [true, "email da ton tai"]
    },
    city:{
        type:String,
    },
    district:{
        type:String,
    },
    ward:{
        type:String,
    },
    address:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
        required:true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
    timestamps:true
})
userSchema.pre('save',function(next){
    if(this.isModified("password")){
        let salt = bcrypt.genSaltSync(10);
        let encrypted = bcrypt.hashSync(this.password+"",salt);
        this.password =encrypted;
    }
    next()
})
module.exports = mongoose.model('User',userSchema)