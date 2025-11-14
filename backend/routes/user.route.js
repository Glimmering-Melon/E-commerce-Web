import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	getAllUsers,
	getUserDetails,
	updateUserRole,
	deleteUser,
	getUserStats,
} from "../controllers/user.controller.js";

const router = express.Router();

// All routes require admin access
router.get("/", protectRoute, adminRoute, getAllUsers);
router.get("/stats", protectRoute, adminRoute, getUserStats);
router.get("/:userId", protectRoute, adminRoute, getUserDetails);
router.patch("/:userId/role", protectRoute, adminRoute, updateUserRole);
router.delete("/:userId", protectRoute, adminRoute, deleteUser);

export default router;
