const express=require('express');
const user=require('../model/user')
const router=express.Router();
const cloudinary=require('../utils/cloudinary');
const upload=require('../utils/multer');
let click=0;
router.post('/',upload.single('image'),async(req,res)=>{
    click++;
    console.log('hello')
    try{
        const result=await cloudinary.uploader.upload(req.file.path)
         await user.create({
            name:result.original_filename,
            avatar:result.secure_url,
            cloudinary_id:result.public_id,
            sno: click,
        });
        
        res.render('index');
        
    }catch(err){
        console.log(err)
    }
})
module.exports=router;