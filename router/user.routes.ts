import { Router } from "express";
import { getAllUsers,getUserByUsername,removeAvatar,setAvatar,updateProfile } from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../validators/user.validator";
import { avatarUploads } from "../middleware/upload";
const router = Router();

router.get("/", authenticate, getAllUsers);
router.get("/:username", authenticate, getUserByUsername);
router.patch("/profile", authenticate, validate(updateProfileSchema), updateProfile);
router.put("/avatar",authenticate,avatarUploads,setAvatar)
router.delete("/avatar",authenticate,removeAvatar)

export default router;