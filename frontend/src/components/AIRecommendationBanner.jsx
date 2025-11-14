import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const AIRecommendationBanner = ({ aiRecommendations }) => {
	if (!aiRecommendations) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mt-6"
		>
			<div className="flex items-start gap-4">
				<Sparkles className="w-8 h-8 text-white flex-shrink-0 mt-1" />
				<div className="flex-1">
					<h3 className="text-xl font-bold text-white mb-2">
						🎉 AI Recommendations Updated!
					</h3>
					<p className="text-white/90 mb-4">
						Based on your recent purchase, we've updated your personalized recommendations
					</p>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
							<div className="flex items-center gap-2 mb-1">
								<TrendingUp className="w-4 h-4 text-white" />
								<span className="text-white/80 text-sm">Predicted Spend</span>
							</div>
							<p className="text-2xl font-bold text-white">
								${aiRecommendations.predicted_amount}
							</p>
						</div>
						
						<div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
							<div className="flex items-center gap-2 mb-1">
								<ShoppingBag className="w-4 h-4 text-white" />
								<span className="text-white/80 text-sm">Top Category</span>
							</div>
							<p className="text-2xl font-bold text-white capitalize">
								{aiRecommendations.predicted_category}
							</p>
						</div>
						
						<div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
							<div className="flex items-center gap-2 mb-1">
								<Sparkles className="w-4 h-4 text-white" />
								<span className="text-white/80 text-sm">Your Segment</span>
							</div>
							<p className="text-2xl font-bold text-white">
								{aiRecommendations.customer_segment}
							</p>
						</div>
					</div>

					<Link
						to="/ai-recommendations"
						className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
					>
						View AI Recommendations →
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default AIRecommendationBanner;
