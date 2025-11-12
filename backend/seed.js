import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import Order from "./models/order.model.js";

dotenv.config();

const sampleProducts = [
	{
		name: "Slim Fit Jeans",
		description: "Classic blue denim jeans with a modern slim fit",
		price: 79,
		image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
		category: "jeans",
		isFeatured: true,
	},
	{
		name: "Ripped Skinny Jeans",
		description: "Trendy black ripped jeans for a stylish look",
		price: 89,
		image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
		category: "jeans",
	},
	{
		name: "Classic White T-Shirt",
		description: "Essential cotton t-shirt for everyday wear",
		price: 29,
		image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
		category: "t-shirts",
		isFeatured: true,
	},
	{
		name: "Graphic Print T-Shirt",
		description: "Cool graphic design t-shirt in premium cotton",
		price: 39,
		image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
		category: "t-shirts",
	},
	{
		name: "Running Shoes",
		description: "Comfortable athletic shoes for running and training",
		price: 129,
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
		category: "shoes",
		isFeatured: true,
	},
	{
		name: "Leather Sneakers",
		description: "Premium leather sneakers for casual style",
		price: 159,
		image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
		category: "shoes",
	},
	{
		name: "Aviator Sunglasses",
		description: "Classic aviator style with UV protection",
		price: 149,
		image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
		category: "glasses",
	},
	{
		name: "Round Frame Glasses",
		description: "Vintage-inspired round frame eyeglasses",
		price: 99,
		image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500",
		category: "glasses",
		isFeatured: true,
	},
	{
		name: "Leather Jacket",
		description: "Genuine leather jacket with classic biker style",
		price: 299,
		image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
		category: "jackets",
		isFeatured: true,
	},
	{
		name: "Denim Jacket",
		description: "Casual denim jacket perfect for layering",
		price: 119,
		image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
		category: "jackets",
	},
	{
		name: "Business Suit",
		description: "Professional two-piece suit in charcoal gray",
		price: 499,
		image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
		category: "suits",
	},
	{
		name: "Slim Fit Suit",
		description: "Modern slim fit suit in navy blue",
		price: 449,
		image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
		category: "suits",
		isFeatured: true,
	},
	{
		name: "Leather Backpack",
		description: "Stylish leather backpack for work and travel",
		price: 189,
		image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
		category: "bags",
	},
	{
		name: "Canvas Tote Bag",
		description: "Eco-friendly canvas tote for everyday use",
		price: 49,
		image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
		category: "bags",
	},
];

const sampleUsers = [
	{
		name: "Admin User",
		email: "admin@example.com",
		password: "admin123",
		role: "admin",
	},
	{
		name: "John Doe",
		email: "john@example.com",
		password: "password123",
		role: "customer",
	},
	{
		name: "Jane Smith",
		email: "jane@example.com",
		password: "password123",
		role: "customer",
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

		// Create sample orders
		const sampleOrders = [
			{
				user: users[1]._id, // John Doe
				products: [
					{
						product: products[0]._id, // Slim Fit Jeans
						quantity: 2,
						price: products[0].price,
					},
					{
						product: products[2]._id, // Classic White T-Shirt
						quantity: 3,
						price: products[2].price,
					},
				],
				totalAmount: products[0].price * 2 + products[2].price * 3,
				stripeSessionId: "cs_test_" + Date.now() + "_1",
			},
			{
				user: users[2]._id, // Jane Smith
				products: [
					{
						product: products[4]._id, // Running Shoes
						quantity: 1,
						price: products[4].price,
					},
					{
						product: products[8]._id, // Leather Jacket
						quantity: 1,
						price: products[8].price,
					},
				],
				totalAmount: products[4].price + products[8].price,
				stripeSessionId: "cs_test_" + Date.now() + "_2",
			},
			{
				user: users[1]._id, // John Doe
				products: [
					{
						product: products[11]._id, // Slim Fit Suit
						quantity: 1,
						price: products[11].price,
					},
				],
				totalAmount: products[11].price,
				stripeSessionId: "cs_test_" + Date.now() + "_3",
			},
			{
				user: users[2]._id, // Jane Smith
				products: [
					{
						product: products[7]._id, // Round Frame Glasses
						quantity: 1,
						price: products[7].price,
					},
					{
						product: products[12]._id, // Leather Backpack
						quantity: 1,
						price: products[12].price,
					},
					{
						product: products[3]._id, // Graphic Print T-Shirt
						quantity: 2,
						price: products[3].price,
					},
				],
				totalAmount: products[7].price + products[12].price + products[3].price * 2,
				stripeSessionId: "cs_test_" + Date.now() + "_4",
			},
		];

		const orders = await Order.insertMany(sampleOrders);
		console.log(`✅ Created ${orders.length} orders`);

		console.log("\n🎉 Database seeded successfully!");
		console.log("\nSample credentials:");
		console.log("Admin: admin@example.com / admin123");
		console.log("User: john@example.com / password123");
		console.log("User: jane@example.com / password123");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();
