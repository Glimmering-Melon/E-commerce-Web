import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();
	const { user } = useUserStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				{/* AI Banner */}
				{user && (
					<Link to='/ai-recommendations'>
						<div className='mb-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg p-6 hover:from-emerald-500 hover:to-blue-500 transition-all duration-300 cursor-pointer shadow-lg'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									<Sparkles className='w-12 h-12 text-white' />
									<div>
										<h2 className='text-2xl font-bold text-white mb-1'>
											AI-Powered Recommendations
										</h2>
										<p className='text-white/90'>
											Discover products tailored just for you with our smart AI
										</p>
									</div>
								</div>
								<div className='hidden md:block'>
									<span className='bg-white/20 text-white px-4 py-2 rounded-full font-semibold'>
										Try Now →
									</span>
								</div>
							</div>
						</div>
					</Link>
				)}

				{/* Featured Products - Moved to top */}
				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4 mt-16'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
			</div>
		</div>
	);
};
export default HomePage;
