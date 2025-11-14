import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { updateUserStats } from "../utils/updateUserStats.js";

// Simple checkout without Stripe
export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, paymentMethod } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Calculate total
		products.forEach((product) => {
			totalAmount += product.price * product.quantity;
		});

		// Apply coupon if exists
		let coupon = null;
		let discount = 0;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				discount = (totalAmount * coupon.discountPercentage) / 100;
				totalAmount -= discount;
			}
		}

		// Create order immediately (no payment gateway)
		const newOrder = new Order({
			user: req.user._id,
			products: products.map((p) => ({
				product: p._id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount: totalAmount,
			stripeSessionId: "order_" + Date.now(), // Simple order ID
		});

		await newOrder.save();

		// Deactivate coupon if used
		if (coupon) {
			coupon.isActive = false;
			await coupon.save();
		}

		// Create new coupon if order >= $200
		if (totalAmount >= 200) {
			await createNewCoupon(req.user._id);
		}

		// Update user stats for AI
		await updateUserStats(req.user._id);

		// Clear user's cart
		await User.findByIdAndUpdate(req.user._id, { cartItems: [] });

		// Get updated AI recommendations based on new order
		let aiRecommendations = null;
		try {
			const axios = (await import("axios")).default;
			const AI_API_URL = process.env.AI_API_URL || "http://localhost:5001";
			
			// Get customer data for AI
			const user = await User.findById(req.user._id);
			const orders = await Order.find({ user: req.user._id }).populate("products.product");
			
			// Calculate most purchased category
			const categoryCounts = {};
			orders.forEach(order => {
				order.products.forEach(item => {
					const category = item.product.category;
					categoryCounts[category] = (categoryCounts[category] || 0) + item.quantity;
				});
			});
			
			const mostPurchasedCategory = Object.keys(categoryCounts).length > 0
				? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
				: "Clothing";
			
			const customerData = {
				Age: user.age || 30,
				Gender: user.gender || "Male",
				Category: mostPurchasedCategory,
				Location: user.location || "California",
				Size: user.preferredSize || "M",
				Season: getCurrentSeason(),
				"Subscription Status": user.subscriptionStatus || "No",
				"Previous Purchases": orders.length,
				"Frequency of Purchases": calculateFrequency(orders),
			};
			
			const aiResponse = await axios.post(`${AI_API_URL}/api/ai/predict`, customerData);
			aiRecommendations = aiResponse.data;
		} catch (error) {
			console.log("AI recommendations not available:", error.message);
		}

		res.status(200).json({
			success: true,
			message: "Order created successfully",
			orderId: newOrder._id,
			totalAmount: totalAmount,
			discount: discount,
			aiRecommendations: aiRecommendations,
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
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

// Get order history
export const getOrderHistory = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("products.product")
			.sort({ createdAt: -1 });

		res.status(200).json({ orders });
	} catch (error) {
		console.error("Error fetching order history:", error);
		res.status(500).json({ message: "Error fetching order history", error: error.message });
	}
};

// Get single order details
export const getOrderDetails = async (req, res) => {
	try {
		const order = await Order.findOne({
			_id: req.params.orderId,
			user: req.user._id,
		}).populate("products.product");

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.status(200).json({ order });
	} catch (error) {
		console.error("Error fetching order details:", error);
		res.status(500).json({ message: "Error fetching order details", error: error.message });
	}
};

// Legacy endpoint for compatibility
export const checkoutSuccess = async (req, res) => {
	res.status(200).json({
		success: true,
		message: "Order already created",
	});
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
