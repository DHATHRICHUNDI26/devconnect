import {User} from "../models/user.model.js"
const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are important!!!"})
        }
        const existing=await User.findOne({email:email.toLowerCase()});
        if(existing){
            return res.status(400).json({message:"user already exists"});
        }
        //create user
        const user=await User.create({
            username,
            email:email.toLowerCase(),
            password,
            loggedIn:false,
        });
        res.status(201).json({message:"user created successfully",
            user:
            {id:user._id,email:user.email,username:user.username}
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error",error:error.message});
        
    }
}
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({
            email:email.toLowerCase()
        });
        if(!user)
            return res.status(400).json({message:"user not found"})
        const isMatch=await user.comparePassword(password);
        if(!isMatch)
            return res.status(400).json({
        message:"Invalid credintals"})
        res.status(200).json({message:"user logged in",
            user:{
                id:user._id,
                email:user.email,
                username:user.username
            }
        });
    } catch (error) {
        res.status(500).json({message:"Internal server Error"})
    }
}
const logoutuser=async (req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email})
        if(!user) return res.status(404).json({message:"user not found"});
        res.status(200).json({message:"log out succesful"});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}
export {
    registerUser,
    loginUser,
    logoutuser
}