import {User} from "../models/user.model.js"
import { RefreshToken } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken"
const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are important!!!"})
        }
        const existingEmail=await User.findOne({email:email.toLowerCase()});
        if(existingEmail){
            return res.status(400).json({message:"user already exists"});
        }
        const existingUsername=await User.findOne({
            username:username.toLowerCase()
        })
        if(existingUsername){
            return res.status(400).json({message:"username already exists"});
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
            return res.status(404).json({message:"Email does not exist"})
        const isMatch=await user.comparePassword(password);
        if(!isMatch)
            return res.status(401).json({
        message:"Incorrect password"})
        const accessToken=jwt.sign(
            {userId:user._id},
            process.env. JWT_SECRET,
            {expiresIn:"1h"});
        const refreshToken=jwt.sign(
            {userId:user._id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn:"7d"})
        await RefreshToken.create({
            user:user._id,
            token:refreshToken,
            expiresAt:new Date(Date.now()+7*24*60*60*1000)
        })
        res.status(200).json({message:"user logged in",
            accessToken,
            refreshToken,
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
const refreshAccessToken=async (req,res)=>{
    try {
        const {refreshToken}=req.body;
        if(!refreshToken){
            return res.status(401).json({message:"Refresh token is required"})
        }
        const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
        const storedToken=await RefreshToken.findOne({token:refreshToken});
        if(!storedToken){
             return res.status(401).json({message:"Invalid refresh token"})
        }
        if(storedToken.expiresAt<Date.now()){
            await RefreshToken.deleteOne({_id:storedToken._id})
             return res.status(401).json({message:"Refresh token is required"})
        }
        const accessToken=jwt.sign(
            {userId:decoded.userId},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );
        return res.status(200).json({
            message:"Access token refreshed successfully",
            accessToken
        })
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired refresh token"
        })
    }
}
const logoutuser=async (req,res)=>{
    try {
        const {refreshToken}=req.body
        if(!refreshToken){
            return res.status(400).json({message:"Refresh Token is required"})
        }
        const deletedToken=await RefreshToken.findOneAndDelete({token:refreshToken});
        if(!deletedToken){
            return res.status(401).json({message:"Invalid refresh token"})
        }
         return res.status(200).json({
            message:"Logout successful"
        })
    } catch (error) {
         return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutuser
}