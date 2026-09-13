import {Post} from "../models/post.model.js"

const createPost=async(req,res)=>{
    try{
        const {name,description,age}=req.body
        if(!name||!description||!age){
            return res.status(400).json({message:"All fields are important!!!"})
        }
        const post=await Post.create({name,description,age})
        return res.status(201).json({message:"post created successfully"})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}
const getPosts=async(req,res)=>{
    try{
        const posts=await Post.find()
        res.status(200).json(posts);
    }
    catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}
const updatePost=async(req,res)=>{
    try{
            if(Object.keys(req.body).length==0){
                return res.status(400).json({message:"No data provided"});
            }
            const post=await Post.findByIdAndUpdate(req.params.id,req.body,{new:true});
            if(!post){
                res.status(404).json({message:"post not found"});
            }
            res.status(200).json({message:"post updated"});
    }
    catch(error){
         return res.status(500).json({message:"Internal server error"})
    }
}
const deletePost=async(req,res)=>{
    try{
           
            const deleted=await Post.findByIdAndUpdate(req.params.id);
            if(!deleted){
                res.status(404).json({message:"post not found"});
            }
            res.status(200).json({message:"post deleted"});
    }
    catch(error){
         return res.status(500).json({message:"Internal server error"})
    }
}
export {createPost,getPosts,updatePost,deletePost}