import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { Sparkles, TrendingUp, Target, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const AIRecommendationsPage = () => {
	const [recommendations, setRecommendations] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchRecommendations();
	}, []);

	const fetchRecommendations = async (showToast = false) => {
		try {
			setRefreshing(true);
			const res = await axios.get("/ai/recommendations");
			setRecommendations(res.data);
			if (showToast) {
				toast.success("AI Recommendations refreshed!");
			}
		} catch (error) {
			console.error("Error fetching AI recommendations:", error);
			if (showToast) {
				toast.error("Failed to refresh recommendations");
			}
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
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
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<div className="flex items-center justify-center gap-2 mb-4">
						<Sparkles className="w-8 h-8 text-emerald-400" />
						<h1 className="text-4xl font-bold text-white">AI-Powered Recommendations</h1>
					</div>
					<p className="text-gray-300 text-lg mb-4">{recommendations?.message}</p>
					<button
						onClick={() => fetchRecommendations(true)}
						disabled={refreshing}
						className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
					>
						<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
						{refreshing ? 'Refreshing...' : 'Refresh Recommendations'}
					</button>
				</motion.div>

				{/* AI Insights */}
				{recommendations?.prediction && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-gray-800 rounded-lg p-6 border border-emerald-500"
						>
							<div className="flex items-center gap-3 mb-2">
								<Target className="w-6 h-6 text-emerald-400" />
								<h3 className="text-lg font-semibold text-white">Predicted Spend</h3>
							</div>
							<p className="text-3xl font-bold text-emerald-400">
								${recommendations.prediction.predicted_amount}
							</p>
							<p className="text-gray-400 text-sm mt-2">Based on your shopping behavior</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1 }}
							className="bg-gray-800 rounded-lg p-6 border border-blue-500"
						>
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-6 h-6 text-blue-400" />
								<h3 className="text-lg font-semibold text-white">Top Category</h3>
							</div>
							<p className="text-3xl font-bold text-blue-400 capitalize">
								{recommendations.prediction.predicted_category}
							</p>
							<p className="text-gray-400 text-sm mt-2">You'll likely buy from this category</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							className="bg-gray-800 rounded-lg p-6 border border-purple-500"
						>
							<div className="flex items-center gap-3 mb-2">
								<Sparkles className="w-6 h-6 text-purple-400" />
								<h3 className="text-lg font-semibold text-white">Customer Segment</h3>
							</div>
							<p className="text-3xl font-bold text-purple-400">
								{recommendations.prediction.customer_segment}
							</p>
							<p className="text-gray-400 text-sm mt-2">Your shopping profile</p>
						</motion.div>
					</div>
				)}

				{/* Top Categories */}
				{recommendations?.prediction?.top_categories && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gray-800 rounded-lg p-6 mb-12"
					>
						<h3 className="text-xl font-semibold text-white mb-4">
							Categories You Might Love
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{recommendations.prediction.top_categories.map((cat, index) => (
								<div
									key={index}
									className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
								>
									<span className="text-white capitalize font-medium">{cat.category}</span>
									<span className="text-emerald-400 font-bold">{cat.probability}%</span>
								</div>
							))}
						</div>
					</motion.div>
				)}

				{/* Recommended Products */}
				<div>
					<h2 className="text-2xl font-bold text-white mb-6">Recommended For You</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{recommendations?.products?.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIRecommendationsPage;
