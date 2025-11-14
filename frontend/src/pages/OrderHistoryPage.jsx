import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { Package, Calendar, DollarSign, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const res = await axios.get("/payments/orders");
			setOrders(res.data.orders);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold text-white mb-2">Order History</h1>
					<p className="text-gray-400">View all your past orders</p>
				</motion.div>

				{orders.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="bg-gray-800 rounded-lg p-12 text-center"
					>
						<ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-white mb-2">No orders yet</h2>
						<p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
						<Link
							to="/"
							className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
						>
							Start Shopping
						</Link>
					</motion.div>
				) : (
					<div className="space-y-6">
						{orders.map((order, index) => (
							<motion.div
								key={order._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition"
							>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
									<div className="flex items-center gap-3 mb-4 md:mb-0">
										<Package className="w-8 h-8 text-emerald-400" />
										<div>
											<h3 className="text-lg font-semibold text-white">
												Order #{order._id.slice(-8)}
											</h3>
											<div className="flex items-center gap-2 text-gray-400 text-sm">
												<Calendar className="w-4 h-4" />
												{formatDate(order.createdAt)}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<DollarSign className="w-5 h-5 text-emerald-400" />
										<span className="text-2xl font-bold text-emerald-400">
											${order.totalAmount.toFixed(2)}
										</span>
									</div>
								</div>

								<div className="border-t border-gray-700 pt-4">
									<h4 className="text-sm font-semibold text-gray-400 mb-3">
										Items ({order.products.length})
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{order.products.map((item) => (
											<div
												key={item._id}
												className="flex items-center gap-3 bg-gray-700 rounded-lg p-3"
											>
												<img
													src={item.product.image}
													alt={item.product.name}
													className="w-16 h-16 object-cover rounded"
												/>
												<div className="flex-1 min-w-0">
													<p className="text-white font-medium truncate">
														{item.product.name}
													</p>
													<p className="text-gray-400 text-sm">
														Qty: {item.quantity} × ${item.price}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderHistoryPage;
