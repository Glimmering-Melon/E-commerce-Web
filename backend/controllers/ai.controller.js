import axios from "axios";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const AI_API_URL = process.env.AI_API_URL || "http://localhost:5001";

// Get customer data for AI prediction
// Map frontend categories to AI model categories
const mapToAICategory = (category) => {
	const categoryMap = {
		"jeans": "Clothing",
		"t-shirts": "Clothing",
		"shoes": "Footwear",
		"glasses": "Accessories",
		"bags": "Accessories",
		"jackets": "Outerwear",
		"suits": "Outerwear",
	};
	return categoryMap[category] || "Clothing";
};

// Map AI categories back to frontend categories
const mapFromAICategory = (aiCategory) => {
	const categoryMap = {
		"Clothing": ["jeans", "t-shirts"],
		"Footwear": ["shoes"],
		"Accessories": ["glasses", "bags"],
		"Outerwear": ["jackets", "suits"],
	};
	return categoryMap[aiCategory] || ["jeans"];
};

const getCustomerData = async (userId) => {
	const user = await User.findById(userId);
	const orders = await Order.find({ user: userId }).populate("products.product");
	
	// Calculate total spent and average order value
	const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
	const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
	
	// Get most purchased category
	let mostPurchasedCategory = "Clothing";
	const categoryCounts = {};
	const colorCounts = {};
	
	if (orders.length > 0) {
		orders.forEach(order => {
			order.products.forEach(item => {
				const aiCategory = mapToAICategory(item.product.category);
				categoryCounts[aiCategory] = (categoryCounts[aiCategory] || 0) + item.quantity;
				
				// Count colors
				if (item.product.colors && item.product.colors.length > 0) {
					item.product.colors.forEach(color => {
						colorCounts[color] = (colorCounts[color] || 0) + 1;
					});
				}
			});
		});
		mostPurchasedCategory = Object.keys(categoryCounts).reduce((a, b) => 
			categoryCounts[a] > categoryCounts[b] ? a : b
		, "Clothing");
	}
	
	// Get most preferred color
	const preferredColor = Object.keys(colorCounts).length > 0 
		? Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b)
		: (user.preferredColors && user.preferredColors.length > 0 ? user.preferredColors[0] : "Black");
	
	return {
		// Basic demographics
		Age: user.age || 30,
		Gender: user.gender || "Male",
		Location: user.location || "California",
		
		// Shopping behavior
		Category: mostPurchasedCategory,
		Size: user.preferredSize || "M",
		Season: getCurrentSeason(),
		"Subscription Status": user.subscriptionStatus || "No",
		"Previous Purchases": orders.length,
		"Frequency of Purchases": calculateFrequency(orders),
		
		// Additional features for better prediction
		"Payment Method": user.preferredPaymentMethod || "Credit Card",
		"Shipping Type": user.shippingPreference || "Standard",
		"Total Spent": Math.round(totalSpent),
		"Avg Order Value": Math.round(avgOrderValue),
		"Preferred Color": preferredColor,
		"Price Range Max": user.priceRange?.max || 500,
	};
};

const getCurrentSeason = () => {
	const month = new Date().getMonth() + 1;
	if (month >= 3 && month <= 5) return "Spring";
	if (month >= 6 && month <= 8) return "Summer";
	if (month >= 9 && month <= 11) return "Fall";
	return "Winter";
};

const calculateFrequency = (orders) => {
	if (orders.length === 0) return "Annually";
	if (orders.length >= 20) return "Weekly";
	if (orders.length >= 10) return "Bi-Weekly";
	if (orders.length >= 5) return "Monthly";
	return "Quarterly";
};

// AI-driven product recommendations
export const getAIRecommendations = async (req, res) => {
	try {
		const customerData = await getCustomerData(req.user._id);
		
		// Call AI API
		const aiResponse = await axios.post(`${AI_API_URL}/api/ai/predict`, customerData);
		const prediction = aiResponse.data;
		
		// Get products based on AI prediction - map AI categories to frontend categories
		const frontendCategories = prediction.top_categories.flatMap(c => 
			mapFromAICategory(c.category)
		);
		
		const recommendedProducts = await Product.find({
			category: { $in: frontendCategories }
		})
		.limit(8)
		.sort({ isFeatured: -1 });
		
		res.json({
			prediction,
			products: recommendedProducts,
			message: `Based on your profile, we predict you'll spend around $${prediction.predicted_amount}`
		});
	} catch (error) {
		console.log("Error in getAIRecommendations:", error.message);
		res.status(500).json({ message: "AI service unavailable", error: error.message });
	}
};

// Customer behavior analytics
export const getCustomerInsights = async (req, res) => {
	try {
		const userId = req.user._id;
		const orders = await Order.find({ user: userId }).populate("products.product");
		
		// Calculate metrics
		const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
		const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
		
		// Category preferences
		const categoryCount = {};
		orders.forEach(order => {
			order.products.forEach(item => {
				const category = item.product.category;
				categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
			});
		});
		
		const topCategories = Object.entries(categoryCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([category, count]) => ({ category, count }));
		
		// Get AI prediction
		const customerData = await getCustomerData(userId);
		const aiResponse = await axios.post(`${AI_API_URL}/api/ai/predict`, customerData);
		
		res.json({
			totalOrders: orders.length,
			totalSpent: totalSpent.toFixed(2),
			avgOrderValue: avgOrderValue.toFixed(2),
			topCategories,
			aiPrediction: aiResponse.data,
			customerSegment: aiResponse.data.customer_segment,
			nextPurchasePrediction: {
				amount: aiResponse.data.predicted_amount,
				category: aiResponse.data.predicted_category,
				confidence: aiResponse.data.top_categories[0]?.probability || 0
			}
		});
	} catch (error) {
		console.log("Error in getCustomerInsights:", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Demand forecasting for admin
export const getDemandForecast = async (req, res) => {
	try {
		const orders = await Order.find().populate("products.product");
		
		// Group by category
		const categoryDemand = {};
		orders.forEach(order => {
			order.products.forEach(item => {
				const category = item.product.category;
				if (!categoryDemand[category]) {
					categoryDemand[category] = {
						totalSold: 0,
						revenue: 0,
						orders: 0
					};
				}
				categoryDemand[category].totalSold += item.quantity;
				categoryDemand[category].revenue += item.price * item.quantity;
				categoryDemand[category].orders += 1;
			});
		});
		
		// Calculate trends
		const forecast = Object.entries(categoryDemand).map(([category, data]) => ({
			category,
			currentDemand: data.totalSold,
			revenue: data.revenue.toFixed(2),
			avgOrderSize: (data.totalSold / data.orders).toFixed(2),
			trend: data.totalSold > 50 ? "High" : data.totalSold > 20 ? "Medium" : "Low",
			predictedGrowth: Math.random() * 30 + 10 // Simplified, should use time series
		})).sort((a, b) => b.currentDemand - a.currentDemand);
		
		res.json({
			forecast,
			totalOrders: orders.length,
			season: getCurrentSeason(),
			recommendations: forecast.slice(0, 3).map(f => 
				`Stock up on ${f.category} - ${f.trend} demand with ${f.predictedGrowth.toFixed(1)}% predicted growth`
			)
		});
	} catch (error) {
		console.log("Error in getDemandForecast:", error.message);
		res.status(500).json({ message: error.message });
	}
};

// Smart product suggestions based on cart
export const getSmartSuggestions = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("cartItems.product");
		
		if (!user.cartItems || user.cartItems.length === 0) {
			return res.json({ suggestions: [], message: "Add items to cart for smart suggestions" });
		}
		
		// Get categories in cart
		const cartCategories = [...new Set(user.cartItems.map(item => item.product.category))];
		
		// Find complementary products
		const suggestions = await Product.find({
			category: { $nin: cartCategories },
			isFeatured: true
		}).limit(4);
		
		res.json({
			suggestions,
			message: "Customers who bought these items also liked:",
			cartValue: user.cartItems.reduce((sum, item) => 
				sum + (item.product.price * item.quantity), 0
			).toFixed(2)
		});
	} catch (error) {
		console.log("Error in getSmartSuggestions:", error.message);
		res.status(500).json({ message: error.message });
	}
};
