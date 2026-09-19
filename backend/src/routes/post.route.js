import {Router} from "express"
import {createPost, deletePost, getPosts, updatePost,getMyPosts} from "../controller/post.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
const router=Router()

// router.route("/create").post(createPost)
// router.route("/getPosts").get(getPosts)
// router.route("/update/:id").patch(updatePost)
// router.route("/delete/:id").delete(deletePost)
router.post("/create",verifyToken,createPost);
router.get("/getPosts",verifyToken,getPosts);
router.patch("/update/:id",verifyToken,updatePost)
router.delete("/delete/:id",verifyToken,deletePost)
router.get("/my-posts",verifyToken,getMyPosts)
export default router