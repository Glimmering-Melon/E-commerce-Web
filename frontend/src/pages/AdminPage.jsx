import { BarChart, PlusCircle, ShoppingBasket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import UsersList from "../components/UsersList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "users", label: "Users", icon: Users },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	useEffect(() => {
		if (activeTab === "users") {
			fetchUsers();
		}
	}, [activeTab]);

	const fetchUsers = async () => {
		setLoadingUsers(true);
		try {
			const res = await axios.get("/users");
			setUsers(res.data.users);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoadingUsers(false);
		}
	};

	const handleUserDeleted = (userId) => {
		setUsers(users.filter((user) => user._id !== userId));
	};

	const handleRoleUpdated = (userId, newRole) => {
		setUsers(
			users.map((user) =>
				user._id === userId ? { ...user, role: newRole } : user
			)
		);
	};

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "users" && (
					<div>
						{loadingUsers ? (
							<div className="flex justify-center items-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
							</div>
						) : (
							<UsersList
								users={users}
								onUserDeleted={handleUserDeleted}
								onRoleUpdated={handleRoleUpdated}
							/>
						)}
					</div>
				)}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
	);
};
export default AdminPage;
