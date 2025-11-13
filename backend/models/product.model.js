import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		// Additional fields for AI recommendations
		sizes: [{
			type: String,
			enum: ["XS", "S", "M", "L", "XL", "XXL"],
		}],
		colors: [{
			type: String,
		}],
		season: {
			type: String,
			enum: ["Spring", "Summer", "Fall", "Winter", "All Season"],
			default: "All Season",
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Unisex"],
			default: "Unisex",
		},
		stock: {
			type: Number,
			default: 100,
		},
		soldCount: {
			type: Number,
			default: 0,
		},
		viewCount: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
			default: 4.0,
		},
		reviewCount: {
			type: Number,
			default: 0,
		},
		tags: [{
			type: String,
		}],
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
