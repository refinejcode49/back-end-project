const {Schema,model}=require('mongoose')

const recommendationSchema=new Schema(
   {
    category:{
        type:String,
        required:true,
        enum:['movie','song','book','quote'],
    },
    content:{
        type:String,
        required:true,
    },
    link:String,
    mood:{
        type:String,
        required:true,
        enum:['happy','sad','angry','anxious','romantic','bored'],
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
   },
   {timestamp:true}
)
module.exports=model('Recommendation',recommendationSchema)