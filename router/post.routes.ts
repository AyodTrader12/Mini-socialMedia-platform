import { Router } from "express";
import { createPost } from "../controller/post.controller";
import { validate } from "../middleware/validate";
import { requireVerified } from "../middleware/requireVerified";
import { authenticate } from "../middleware/authenticate";
import { postMediaUpload } from "../middleware/upload";
import { createPostSchema } from "../validators/post.validator";

const router = Router()


router.post("/create-post", authenticate, requireVerified, postMediaUpload, validate(createPostSchema), createPost);

export default router;