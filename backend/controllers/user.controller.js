import User from "../models/user.model.js";
import Order from "../models/order.model.js";

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
			.select("-password -refreshToken")
			.sort({ createdAt: -1 });

		// Get order count for each user
		const usersWithStats = await Promise.all(
			users.map(async (user) => {
				const orderCount = await Order.countDocuments({ user: user._id });
				const orders = await Order.find({ user: user._id });
				const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

				return {
					...user.toObject(),
					orderCount,
					totalSpent: totalSpent.toFixed(2),
				};
			})
		);

		res.json({ users: usersWithStats });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users", error: error.message });
	}
};

// Get single user details (Admin only)
export const getUserDetails = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).select("-password -refreshToken");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get user's orders
		const orders = await Order.find({ user: user._id })
			.populate("products.product")
			.sort({ createdAt: -1 });

		const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

		res.json({
			user: {
				...user.toObject(),
				orderCount: orders.length,
				totalSpent: totalSpent.toFixed(2),
			},
			orders,
		});
	} catch (error) {
		console.error("Error fetching user details:", error);
		res.status(500).json({ message: "Error fetching user details", error: error.message });
	}
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
	try {
		const { role } = req.body;
		const { userId } = req.params;

		if (!["customer", "admin"].includes(role)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ role },
			{ new: true }
		).select("-password -refreshToken");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ message: "User role updated successfully", user });
	} catch (error) {
		console.error("Error updating user role:", error);
		res.status(500).json({ message: "Error updating user role", error: error.message });
	}
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Prevent admin from deleting themselves
		if (userId === req.user._id.toString()) {
			return res.status(400).json({ message: "Cannot delete your own account" });
		}

		const user = await User.findByIdAndDelete(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Optionally delete user's orders
		await Order.deleteMany({ user: userId });

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Error deleting user", error: error.message });
	}
};

// Get user statistics (Admin only)
export const getUserStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const adminUsers = await User.countDocuments({ role: "admin" });
		const customerUsers = await User.countDocuments({ role: "customer" });

		// Users registered in last 30 days
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const newUsers = await User.countDocuments({
			createdAt: { $gte: thirtyDaysAgo },
		});

		// Top spending users
		const users = await User.find().select("-password -refreshToken");
		const usersWithSpending = await Promise.all(
			users.map(async (user) => {
				const orders = await Order.find({ user: user._id });
				const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
				return {
					_id: user._id,
					name: user.name,
					email: user.email,
					totalSpent,
				};
			})
		);

		const topSpenders = usersWithSpending
			.sort((a, b) => b.totalSpent - a.totalSpent)
			.slice(0, 5);

		res.json({
			totalUsers,
			adminUsers,
			customerUsers,
			newUsers,
			topSpenders,
		});
	} catch (error) {
		console.error("Error fetching user stats:", error);
		res.status(500).json({ message: "Error fetching user stats", error: error.message });
	}
};
