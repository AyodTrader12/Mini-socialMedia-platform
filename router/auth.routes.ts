import { Router } from "express"
import { register,login,getMe,changePassword,forgotPassword,resetPassword,resendOtp,verifyAccount } from "../controller/auth.controller"
import { validate } from "../middleware/validate"
import { authenticate } from "../middleware/authenticate"
import { registerSchema,loginSchema,changePasswordSchema,forgotPasswordSchema,resetPasswordSchema,verifyAccountSchema } from "../validators/auth.validator"

const router = Router()

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);

router.post("/verify-account", authenticate, validate(verifyAccountSchema), verifyAccount);
router.post("/resend-otp", authenticate, resendOtp);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default router;