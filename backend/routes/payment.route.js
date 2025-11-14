import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	checkoutSuccess,
	createCheckoutSession,
	getOrderHistory,
	getOrderDetails,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.get("/orders", protectRoute, getOrderHistory);
router.get("/orders/:orderId", protectRoute, getOrderDetails);

export default router;
