const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,

    },
    avatar:{
        type:String,
    },
    cloudinary_id:{
        type:String,
    },
    sno:{
       type:Number,
    }
})
module.exports=mongoose.model('user',UserSchema)