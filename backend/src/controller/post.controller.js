import {Post} from "../models/post.model.js"

const createPost=async(req,res)=>{
    try{
        const {name,description}=req.body
        if(!name||!description){
            return res.status(400).json({message:"All fields are important!!!"})
        }
        const post=await Post.create({name,description,user:req.user.userId})
        return res.status(201).json({message:"post created successfully",post})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}
const getPosts=async(req,res)=>{
    try{
        const posts=await Post.find().populate("user","username")
        return res.status(200).json( {posts});
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
            const post=await Post.findOneAndUpdate( {
            _id:req.params.id,
            user:req.user.userId
            },
            req.body,{new:true,runValidators:true});
            if(!post){
                return res.status(404).json({message:"post not found"});
            }
            return res.status(200).json({message:"post updated",post});
    }
    catch(error){
         return res.status(500).json({message:"Internal server error"})
    }
}
const deletePost=async(req,res)=>{
    try{
           
            const deleted=await Post.findOneAndDelete({
                _id:req.params.id,
                user:req.user.userId
            });
            if(!deleted){
                return res.status(404).json({message:"post not found"});
            }
            return res.status(200).json({message:"post deleted"});
    }
    catch(error){
         return res.status(500).json({message:"Internal server error"})
    }
}
const getMyPosts=async(req,res)=>{
    try{
        const posts=await Post.find({
            user:req.user.userId
        }).populate("user","username")

        return res.status(200).json({
            posts
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
const toggleLike=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.postId)

        if(!post){
            return res.status(404).json({
                message:"Post not found"
            })
        }

        const userId=req.user.userId

        const alreadyLiked=post.likes.includes(userId)

        if(alreadyLiked){
            post.likes=post.likes.filter(
                (id)=>id.toString()!==userId.toString()
            )
        }else{
            post.likes.push(userId)
        }

        await post.save()

        return res.status(200).json({
            message:alreadyLiked?"Post unliked":"Post liked",
            liked:!alreadyLiked,
            likesCount:post.likes.length
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export {createPost,getPosts,updatePost,deletePost,getMyPosts,toggleLike}