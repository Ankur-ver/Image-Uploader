const express=require('express');
const app=express();
const axios = require('axios')
const bodyparser=require('body-parser')
const path=require('path')
 const router=require('./routes/user')
const {mongodbConnect}=require('./connection')
const multer=require('multer')
const dotenv=require('dotenv');
const user=require('./model/user')
const cloudinary=require('cloudinary');
const { image } = require('./utils/cloudinary');
const users = require('./model/user');
const ObjectId = require('mongoose').Types.ObjectId;
dotenv.config();
app.set('view engine','ejs')
app.set('views','view')
app.use(express.json()).use(bodyparser.urlencoded({extended:false}))
 app.use('/user',router)
 app.use(express.static(path.join(__dirname, 'view')));
 app.use('/image',express.static('view'))
 app.use('/:id',express.static('view'))
 mongodbConnect('mongodb://127.0.0.1:27017/image-upload',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
 })
 .then(()=>{
    console.log('connected to mongodb')
 })
const storage=multer.diskStorage({
    destination:(req,files,cb)=>{
       cb(null, 'upload')
    },
    filename:(req,files,cb)=>{
        cb(null,Date.now()+path.extname(files.originalname))
    }
})
const upload=multer({storage:storage})
app.get('/',(req,res)=>{
   res.render('index')
})
async function retrieveData(){
    const data= await users.find({})
    
   const result=await Promise.all(data.map(async (item)=>{
        console.log(item.cloudinary_id)
        const imageId =item.cloudinary_id;
        const imageUrl = cloudinary.url(imageId, { type: 'upload' });
     
        try{
            const imageResponse =await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const contentType = imageResponse.headers['content-type'];
            const imagedata=imageResponse.data;
            return {imagedata:imagedata,
                contentType:contentType};
        }
        catch(error){
            console.log(error)
        }
   
    }))
}
retrieveData();
app.get('/image', async (req, res) => {
    try {
        const data= await users.find({})
  
        const result=await Promise.all(data.map(async (item)=>{
             console.log(item.cloudinary_id)
             const imageId =item.cloudinary_id;
             const imageUrl = cloudinary.url(imageId, { type: 'upload' });
            const sno= item.sno;
             try{
                const imageResponse =await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const contentType = imageResponse.headers['content-type'];
                const imagedata=imageResponse.data;
            
                console.log(sno)
                
                return {
                    imagedata: imagedata,
                    contentType: contentType,
                    id: sno,
                };
               
            }
            catch(error){
                console.log(error)
            }
       
        }))
        console.log(result)
        res.render('images',{
            result:result
        })
    } catch (err) {
        console.error('Error retrieving image:', err);
        res.status(500).send('Error retrieving image');
    }
});

    
app.get('/upload',(req,res)=>{
   
    res.render('upload')
})
app.post('/',upload.single('image'),(req,res)=>{
    console.log(req.file)
    console.log(req.body)
    res.send('image uploaded')
})
app.delete('/:id',async(req,res)=>{
    try{
        let Users=await users.findById(req.params.id);
        console.log(Users)
        await cloudinary.uploader.destroy(Users.cloudinary_id);
        await Users.deleteOne({ _id: req.params.id });
        try {
            const data= await users.find({})
      
            const result=await Promise.all(data.map(async (item)=>{
                 console.log(item.cloudinary_id)
                 const imageId =item.cloudinary_id;
                 const imageUrl = cloudinary.url(imageId, { type: 'upload' });
                 console.log(imageUrl)
                 const id=item._id;
                 try{
                    const imageResponse =await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    const contentType = imageResponse.headers['content-type'];
                    const imagedata=imageResponse.data;
                    return {imagedata:imagedata,
                        contentType:contentType,
                    id:id};
                }
                catch(error){
                    console.log(error)
                }
           
            }))
        
          res.send("images deleted")
            
        } catch (err) {
            console.error('Error retrieving image:', err);
            res.status(500).send('Error retrieving image');
        }
    }catch(error){
        console.log('images not found',error)
    }

        })

app.listen(8000,()=>{
    console.log('server is listening...')
})