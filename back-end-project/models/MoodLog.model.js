const {Schema,model}=require('mongoose');

const moodLogSchema=new Schema(
    {
        mood:{
            type:String,
            required:true,
            enum:['happy','sad','angry','anxious','romantic','bored'],
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
    },
    {timestamps:true}
);
module.exports=model('MoodLog',moodLogSchema);