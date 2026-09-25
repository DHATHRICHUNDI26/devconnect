import {Comment} from "../models/comment.model.js"

const createComment=async(req,res)=>{
    try{
        const {content}=req.body

        if(!content){
            return res.status(400).json({
                message:"Comment content is required"
            })
        }

        const comment=await Comment.create({
            content,
            user:req.user.userId,
            post:req.params.postId
        })

        return res.status(201).json({
            message:"Comment created successfully",
            comment
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
const getComments=async(req,res)=>{
    try{
        const comments=await Comment.find({
            post:req.params.postId
        }).populate("user","username").sort({createdAt:1})

        return res.status(200).json({
            comments
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export {createComment,getComments}