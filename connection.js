const mongoose=require('mongoose');
const mongodbConnect=function(URL){
    return mongoose.connect(URL)
}
module.exports={mongodbConnect}