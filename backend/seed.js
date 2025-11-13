import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import Order from "./models/order.model.js";

dotenv.config();

const sampleProducts = [
	// Clothing Category
	{
		name: "Slim Fit Jeans",
		description: "Classic blue denim jeans with a modern slim fit",
		price: 79,
		image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
		category: "jeans",
		isFeatured: true,
		sizes: ["S", "M", "L", "XL"],
		colors: ["Blue", "Black", "Gray"],
		season: "All Season",
		gender: "Unisex",
		stock: 150,
		soldCount: 89,
		rating: 4.5,
		reviewCount: 45,
		tags: ["casual", "denim", "everyday"],
	},
	{ name: "Ripped Skinny Jeans", description: "Trendy black ripped jeans for a stylish look", price: 89, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500", category: "jeans", sizes: ["S", "M", "L"], colors: ["Black", "Gray"], season: "All Season", gender: "Unisex", stock: 120, soldCount: 67, rating: 4.3, reviewCount: 34, tags: ["trendy", "ripped", "casual"] },
	{ name: "Classic White T-Shirt", description: "Essential cotton t-shirt for everyday wear", price: 29, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", category: "t-shirts", isFeatured: true, sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Gray"], season: "All Season", gender: "Unisex", stock: 200, soldCount: 156, rating: 4.7, reviewCount: 89, tags: ["basic", "essential", "cotton"] },
	{ name: "Graphic Print T-Shirt", description: "Cool graphic design t-shirt in premium cotton", price: 39, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500", category: "t-shirts", sizes: ["M", "L", "XL"], colors: ["Black", "Navy", "White"], season: "Summer", gender: "Unisex", stock: 180, soldCount: 92, rating: 4.4, reviewCount: 56, tags: ["graphic", "trendy", "casual"] },
	{ name: "V-Neck T-Shirt", description: "Comfortable v-neck tee in multiple colors", price: 32, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500", category: "t-shirts", sizes: ["S", "M", "L", "XL"], colors: ["Navy", "Gray", "Burgundy"], season: "All Season", gender: "Male", stock: 150, soldCount: 78, rating: 4.2, reviewCount: 41, tags: ["v-neck", "comfortable", "versatile"] },
	// Footwear
	{ name: "Running Shoes", description: "Comfortable athletic shoes for running and training", price: 129, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "shoes", isFeatured: true, sizes: ["M", "L", "XL"], colors: ["Black", "White", "Blue"], season: "All Season", gender: "Unisex", stock: 100, soldCount: 145, rating: 4.8, reviewCount: 112, tags: ["athletic", "running", "comfortable"] },
	{ name: "Leather Sneakers", description: "Premium leather sneakers for casual style", price: 159, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", category: "shoes", sizes: ["M", "L", "XL"], colors: ["White", "Black", "Brown"], season: "All Season", gender: "Unisex", stock: 90, soldCount: 87, rating: 4.6, reviewCount: 67, tags: ["leather", "premium", "casual"] },
	{ name: "Canvas Sneakers", description: "Classic canvas sneakers for everyday wear", price: 65, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500", category: "shoes", sizes: ["S", "M", "L"], colors: ["White", "Navy", "Red"], season: "Spring", gender: "Unisex", stock: 140, soldCount: 103, rating: 4.3, reviewCount: 78, tags: ["canvas", "classic", "affordable"] },
	// Accessories
	{ name: "Aviator Sunglasses", description: "Classic aviator style with UV protection", price: 149, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", category: "glasses", colors: ["Gold", "Silver", "Black"], season: "Summer", gender: "Unisex", stock: 80, soldCount: 94, rating: 4.5, reviewCount: 62, tags: ["sunglasses", "aviator", "UV protection"] },
	{ name: "Round Frame Glasses", description: "Vintage-inspired round frame eyeglasses", price: 99, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500", category: "glasses", isFeatured: true, colors: ["Black", "Tortoise", "Clear"], season: "All Season", gender: "Unisex", stock: 110, soldCount: 76, rating: 4.4, reviewCount: 54, tags: ["vintage", "round", "eyeglasses"] },
	{ name: "Leather Backpack", description: "Stylish leather backpack for work and travel", price: 189, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "bags", colors: ["Brown", "Black", "Tan"], season: "All Season", gender: "Unisex", stock: 70, soldCount: 112, rating: 4.7, reviewCount: 89, tags: ["leather", "backpack", "professional"] },
	{ name: "Canvas Tote Bag", description: "Eco-friendly canvas tote for everyday use", price: 49, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500", category: "bags", colors: ["Beige", "Navy", "Black"], season: "All Season", gender: "Unisex", stock: 160, soldCount: 134, rating: 4.2, reviewCount: 98, tags: ["eco-friendly", "tote", "casual"] },
	{ name: "Messenger Bag", description: "Professional messenger bag for daily commute", price: 129, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500", category: "bags", isFeatured: true, colors: ["Black", "Brown", "Gray"], season: "All Season", gender: "Unisex", stock: 95, soldCount: 88, rating: 4.6, reviewCount: 71, tags: ["messenger", "professional", "commute"] },
	// Outerwear
	{ name: "Leather Jacket", description: "Genuine leather jacket with classic biker style", price: 299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", category: "jackets", isFeatured: true, sizes: ["M", "L", "XL"], colors: ["Black", "Brown"], season: "Fall", gender: "Unisex", stock: 60, soldCount: 78, rating: 4.9, reviewCount: 67, tags: ["leather", "biker", "premium"] },
	{ name: "Denim Jacket", description: "Casual denim jacket perfect for layering", price: 119, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", category: "jackets", sizes: ["S", "M", "L", "XL"], colors: ["Blue", "Black", "Light Blue"], season: "Spring", gender: "Unisex", stock: 130, soldCount: 102, rating: 4.4, reviewCount: 84, tags: ["denim", "casual", "layering"] },
	{ name: "Bomber Jacket", description: "Stylish bomber jacket for cool weather", price: 159, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500", category: "jackets", sizes: ["M", "L", "XL"], colors: ["Black", "Olive", "Navy"], season: "Fall", gender: "Male", stock: 85, soldCount: 69, rating: 4.5, reviewCount: 52, tags: ["bomber", "stylish", "cool weather"] },
	{ name: "Business Suit", description: "Professional two-piece suit in charcoal gray", price: 499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", category: "suits", sizes: ["M", "L", "XL"], colors: ["Charcoal", "Navy", "Black"], season: "All Season", gender: "Male", stock: 50, soldCount: 45, rating: 4.8, reviewCount: 38, tags: ["business", "professional", "formal"] },
	{ name: "Slim Fit Suit", description: "Modern slim fit suit in navy blue", price: 449, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500", category: "suits", isFeatured: true, sizes: ["S", "M", "L", "XL"], colors: ["Navy", "Charcoal", "Black"], season: "All Season", gender: "Male", stock: 65, soldCount: 56, rating: 4.7, reviewCount: 44, tags: ["slim fit", "modern", "professional"] },
];

const sampleUsers = [
	{
		name: "Admin User",
		email: "admin@example.com",
		password: "admin123",
		role: "admin",
		age: 35,
		gender: "Male",
		location: "California",
		preferredSize: "L",
		subscriptionStatus: "Yes",
		preferredPaymentMethod: "Credit Card",
		shippingPreference: "Express",
		preferredColors: ["Black", "Gray", "Navy"],
		priceRange: { min: 50, max: 500 },
	},
	{
		name: "John Doe",
		email: "john@example.com",
		password: "password123",
		role: "customer",
		age: 28,
		gender: "Male",
		location: "New York",
		preferredSize: "M",
		subscriptionStatus: "Yes",
		preferredPaymentMethod: "PayPal",
		shippingPreference: "Standard",
		favoriteCategories: ["jeans", "t-shirts"],
		preferredColors: ["Blue", "White", "Black"],
		priceRange: { min: 20, max: 200 },
	},
	{
		name: "Jane Smith",
		email: "jane@example.com",
		password: "password123",
		role: "customer",
		age: 32,
		gender: "Female",
		location: "Texas",
		preferredSize: "S",
		subscriptionStatus: "Yes",
		preferredPaymentMethod: "Credit Card",
		shippingPreference: "Express",
		favoriteCategories: ["shoes", "bags", "glasses"],
		preferredColors: ["Pink", "White", "Beige"],
		priceRange: { min: 50, max: 400 },
	},
	{
		name: "Mike Johnson",
		email: "mike@example.com",
		password: "password123",
		role: "customer",
		age: 45,
		gender: "Male",
		location: "Florida",
		preferredSize: "XL",
		subscriptionStatus: "No",
		preferredPaymentMethod: "Debit Card",
		shippingPreference: "Free Shipping",
		favoriteCategories: ["jackets", "jeans"],
		preferredColors: ["Brown", "Green", "Black"],
		priceRange: { min: 30, max: 300 },
	},
	{
		name: "Sarah Williams",
		email: "sarah@example.com",
		password: "password123",
		role: "customer",
		age: 26,
		gender: "Female",
		location: "Washington",
		preferredSize: "M",
		subscriptionStatus: "Yes",
		preferredPaymentMethod: "Venmo",
		shippingPreference: "2-Day Shipping",
		favoriteCategories: ["suits", "bags", "t-shirts"],
		preferredColors: ["Navy", "White", "Gray"],
		priceRange: { min: 40, max: 600 },
	},
	{
		name: "David Brown",
		email: "david@example.com",
		password: "password123",
		role: "customer",
		age: 38,
		gender: "Male",
		location: "Illinois",
		preferredSize: "L",
		subscriptionStatus: "No",
		preferredPaymentMethod: "Cash",
		shippingPreference: "Standard",
		favoriteCategories: ["shoes", "t-shirts"],
		preferredColors: ["Black", "Red", "White"],
		priceRange: { min: 25, max: 250 },
	},
	{
		name: "Emily Davis",
		email: "emily@example.com",
		password: "password123",
		role: "customer",
		age: 29,
		gender: "Female",
		location: "Oregon",
		preferredSize: "S",
		subscriptionStatus: "Yes",
		preferredPaymentMethod: "PayPal",
		shippingPreference: "Express",
		favoriteCategories: ["jackets", "bags", "glasses"],
		preferredColors: ["Purple", "Pink", "Black"],
		priceRange: { min: 50, max: 350 },
	},
	{
		name: "Robert Wilson",
		email: "robert@example.com",
		password: "password123",
		role: "customer",
		age: 52,
		gender: "Male",
		location: "Arizona",
		preferredSize: "XL",
		subscriptionStatus: "No",
		preferredPaymentMethod: "Bank Transfer",
		shippingPreference: "Free Shipping",
		favoriteCategories: ["suits", "jackets"],
		preferredColors: ["Charcoal", "Navy", "Black"],
		priceRange: { min: 100, max: 800 },
	},
];

async function seedDatabase() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ Connected to MongoDB");

		// Clear existing data
		await User.deleteMany({});
		await Product.deleteMany({});
		await Order.deleteMany({});
		console.log("🗑️  Cleared existing data");

		// Insert users one by one to trigger pre-save hook
		const users = [];
		for (const userData of sampleUsers) {
			const user = await User.create(userData);
			users.push(user);
		}
		console.log(`✅ Created ${users.length} users`);

		const products = await Product.insertMany(sampleProducts);
		console.log(`✅ Created ${products.length} products`);

		// Create random orders for better AI demo
		const sampleOrders = [];
		const orderTemplates = [
			// John Doe - Frequent buyer, loves jeans and t-shirts
			{ user: 1, products: [[0, 2], [2, 3]], total: 0 },
			{ user: 1, products: [[1, 1], [3, 2]], total: 0 },
			{ user: 1, products: [[2, 4], [4, 1]], total: 0 },
			{ user: 1, products: [[0, 1], [5, 1]], total: 0 },
			{ user: 1, products: [[3, 3]], total: 0 },
			
			// Jane Smith - Fashion conscious, accessories lover
			{ user: 2, products: [[5, 1], [13, 1]], total: 0 },
			{ user: 2, products: [[9, 1], [10, 1]], total: 0 },
			{ user: 2, products: [[8, 1], [11, 1]], total: 0 },
			{ user: 2, products: [[2, 2], [12, 1]], total: 0 },
			
			// Mike Johnson - Casual wear, bigger sizes
			{ user: 3, products: [[14, 1], [6, 1]], total: 0 },
			{ user: 3, products: [[0, 2]], total: 0 },
			{ user: 3, products: [[15, 1]], total: 0 },
			
			// Sarah Williams - Young professional, suits and accessories
			{ user: 4, products: [[17, 1], [9, 1]], total: 0 },
			{ user: 4, products: [[2, 3], [10, 1]], total: 0 },
			{ user: 4, products: [[16, 1], [8, 1]], total: 0 },
			{ user: 4, products: [[5, 1], [11, 1]], total: 0 },
			{ user: 4, products: [[3, 2], [12, 1]], total: 0 },
			
			// David Brown - Sporty, footwear enthusiast
			{ user: 5, products: [[5, 2]], total: 0 },
			{ user: 5, products: [[6, 1], [7, 1]], total: 0 },
			{ user: 5, products: [[5, 1], [2, 2]], total: 0 },
			
			// Emily Davis - Trendy, loves jackets and bags
			{ user: 6, products: [[13, 1], [11, 1]], total: 0 },
			{ user: 6, products: [[14, 1], [2, 2]], total: 0 },
			{ user: 6, products: [[15, 1], [12, 1]], total: 0 },
			{ user: 6, products: [[9, 1], [3, 1]], total: 0 },
			
			// Robert Wilson - Business professional
			{ user: 7, products: [[16, 1], [17, 1]], total: 0 },
			{ user: 7, products: [[17, 1]], total: 0 },
			{ user: 7, products: [[16, 1], [8, 1]], total: 0 },
		];

		orderTemplates.forEach((template, index) => {
			const orderProducts = template.products.map(([productIdx, qty]) => ({
				product: products[productIdx]._id,
				quantity: qty,
				price: products[productIdx].price,
			}));
			
			const totalAmount = orderProducts.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			
			sampleOrders.push({
				user: users[template.user]._id,
				products: orderProducts,
				totalAmount,
				stripeSessionId: `cs_test_${Date.now()}_${index}`,
				createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
			});
		});

		const orders = await Order.insertMany(sampleOrders);
		console.log(`✅ Created ${orders.length} orders`);

		// Update user statistics based on orders
		console.log("\n📊 Updating user statistics...");
		for (const user of users) {
			const userOrders = orders.filter(o => o.user.toString() === user._id.toString());
			if (userOrders.length > 0) {
				const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
				const avgOrderValue = totalSpent / userOrders.length;
				const lastPurchase = userOrders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt;
				
				user.totalSpent = totalSpent;
				user.averageOrderValue = avgOrderValue;
				user.lastPurchaseDate = lastPurchase;
				await user.save();
			}
		}
		console.log("✅ User statistics updated");

		console.log("\n🎉 Database seeded successfully!");
		console.log("\n📊 Statistics:");
		console.log(`- ${users.length} users created`);
		console.log(`- ${products.length} products created`);
		console.log(`- ${orders.length} orders created`);
		console.log("\n🔑 Sample credentials:");
		console.log("Admin: admin@example.com / admin123");
		console.log("User: john@example.com / password123");
		console.log("User: jane@example.com / password123");
		console.log("\n💡 Tip: Run 'npm run ai:train' to train the AI model with this data");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();
