import { Router } from "express";
import { getAllUsers,getUserByUsername,updateProfile } from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../validators/user.validator";

const router = Router();

router.get("/", authenticate, getAllUsers);
router.get("/:username", authenticate, getUserByUsername);
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfile);

export default router;