import User from "../models/user.model.js";
import Order from "../models/order.model.js";

/**
 * Update user statistics after order completion
 * This helps AI make better predictions
 */
export const updateUserStats = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user) return;

		const orders = await Order.find({ user: userId }).populate("products.product");

		// Calculate total spent
		const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

		// Calculate average order value
		const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

		// Get last purchase date
		const lastPurchaseDate = orders.length > 0 
			? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt 
			: null;

		// Get favorite categories
		const categoryCounts = {};
		orders.forEach(order => {
			order.products.forEach(item => {
				const category = item.product.category;
				categoryCounts[category] = (categoryCounts[category] || 0) + item.quantity;
			});
		});

		const favoriteCategories = Object.entries(categoryCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([category]) => category);

		// Update user
		user.totalSpent = totalSpent;
		user.averageOrderValue = averageOrderValue;
		user.lastPurchaseDate = lastPurchaseDate;
		user.favoriteCategories = favoriteCategories;

		await user.save();

		console.log(`✅ Updated stats for user ${user.name}`);
	} catch (error) {
		console.error("Error updating user stats:", error);
	}
};
