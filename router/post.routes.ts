import { Router } from "express";
import { createPost } from "../controller/post.controller";
import { validate } from "../middleware/validate";
import { requireVerified } from "../middleware/requireVerified";
import { authenticate } from "../middleware/authenticate";
import { postMediaUpload } from "../middleware/upload";
import { createPostSchema } from "../validators/post.validator";
import { optionalAuth } from "../middleware/optionalAuth";
import { getFeed,getPostById } from "../controller/post.controller";
import { addBookmark,removeBookmark,getSavedPosts } from "../controller/bookmark.controller";
const router = Router()



router.get("/get-feed",authenticate,getFeed)
router.get("/saved",authenticate,getSavedPosts)
router.get("/:id",optionalAuth,getPostById)
router.post("/create-post", authenticate, requireVerified, postMediaUpload, validate(createPostSchema), createPost);

router.post("/:id/add-bookmark",authenticate,addBookmark)
router.delete("/:id/delete-bookmark",authenticate,removeBookmark)
export default router;