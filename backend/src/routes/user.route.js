import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { loginUser,logoutuser, registerUser,refreshAccessToken,searchUsers,getUserProfile,checkEmail } from "../controller/user.controller.js";
const router =Router();
router.post("/register",registerUser)
router.get("/check-email",checkEmail)
router.post("/login",loginUser)
router.get("/search",verifyToken,searchUsers)
router.get("/:userId",verifyToken,getUserProfile)
router.post("/refresh",refreshAccessToken)
router.post("/logout",logoutuser)
export default router;