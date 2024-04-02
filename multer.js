const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({})
const filefilter=(req,res,cb)=>{
    let ext=path.extname(file.originalname);
    if(ext!==".jpg" && ext !==".jpeg"&& ext!==".png"){
        cb(new Error("file type is not supported"),false);
        return;
    }
    cb(null,true);
}

module.exports=multer({ storage:storage,
    filefilter:filefilter,

})