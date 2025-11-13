import express from "express";
import {
	getAIRecommendations,
	getCustomerInsights,
	getDemandForecast,
	getSmartSuggestions,
} from "../controllers/ai.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Customer endpoints
router.get("/recommendations", protectRoute, getAIRecommendations);
router.get("/insights", protectRoute, getCustomerInsights);
router.get("/suggestions", protectRoute, getSmartSuggestions);

// Admin endpoints
router.get("/forecast", protectRoute, adminRoute, getDemandForecast);

export default router;
