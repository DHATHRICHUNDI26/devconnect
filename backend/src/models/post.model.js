import mongoose,{Schema} from "mongoose";
const postSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    likes:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        default:[]
    }
},
{
    timestamps:true
})
export const Post=mongoose.model("Post",postSchema)