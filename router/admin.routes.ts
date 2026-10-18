import { Router } from "express";
import {
  getStats,
  listUsers,
  getUser,
  verifyUser,
  suspendUser,
  unsuspendUser,
  updateRole,
  deleteUser,
} from "../controller/admin.controller";
import { authenticate } from "../middleware/authenticate";
import { requireAdmin } from "../middleware/requireAdmin";
import { validate } from "../middleware/validate";
import { updateRoleSchema } from "../validators/admin.validator";

const router = Router();

// Applies to every route below
router.use(authenticate, requireAdmin);

router.get("/stats", getStats);
router.get("/getAllUsers", listUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/verify", verifyUser);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/unsuspend", unsuspendUser);
router.patch("/users/:id/role", validate(updateRoleSchema), updateRole);
router.delete("/users/deleteUser/:id", deleteUser);

export default router;