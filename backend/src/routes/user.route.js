import { Router } from "express";
import { loginUser,logoutuser, registerUser,refreshAccessToken } from "../controller/user.controller.js";
const router =Router();
router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/refresh",refreshAccessToken)
router.post("/logout",logoutuser)
export default router;