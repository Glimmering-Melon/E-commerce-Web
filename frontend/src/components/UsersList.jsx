import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Shield, User, DollarSign, ShoppingBag } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const UsersList = ({ users, onUserDeleted, onRoleUpdated }) => {
	const [deletingId, setDeletingId] = useState(null);
	const [updatingRoleId, setUpdatingRoleId] = useState(null);

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		setDeletingId(userId);
		try {
			await axios.delete(`/users/${userId}`);
			toast.success("User deleted successfully");
			onUserDeleted(userId);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete user");
		} finally {
			setDeletingId(null);
		}
	};

	const handleToggleRole = async (userId, currentRole) => {
		const newRole = currentRole === "admin" ? "customer" : "admin";
		
		if (!window.confirm(`Change user role to ${newRole}?`)) return;

		setUpdatingRoleId(userId);
		try {
			await axios.patch(`/users/${userId}/role`, { role: newRole });
			toast.success(`User role updated to ${newRole}`);
			onRoleUpdated(userId, newRole);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update role");
		} finally {
			setUpdatingRoleId(null);
		}
	};

	return (
		<motion.div
			className="bg-gray-800 shadow-lg rounded-lg overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className="min-w-full divide-y divide-gray-700">
				<thead className="bg-gray-700">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							User
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							Email
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							Role
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							Orders
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							Total Spent
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>

				<tbody className="bg-gray-800 divide-y divide-gray-700">
					{users.map((user) => (
						<tr key={user._id} className="hover:bg-gray-700">
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									<div className="flex-shrink-0 h-10 w-10">
										<div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
											{user.name.charAt(0).toUpperCase()}
										</div>
									</div>
									<div className="ml-4">
										<div className="text-sm font-medium text-white">{user.name}</div>
									</div>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm text-gray-300">{user.email}</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span
									className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
										user.role === "admin"
											? "bg-purple-100 text-purple-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{user.role === "admin" ? (
										<Shield className="w-3 h-3 mr-1" />
									) : (
										<User className="w-3 h-3 mr-1" />
									)}
									{user.role}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center text-sm text-gray-300">
									<ShoppingBag className="w-4 h-4 mr-1 text-emerald-400" />
									{user.orderCount || 0}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center text-sm text-gray-300">
									<DollarSign className="w-4 h-4 text-emerald-400" />
									{user.totalSpent || "0.00"}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button
									onClick={() => handleToggleRole(user._id, user.role)}
									disabled={updatingRoleId === user._id}
									className="text-indigo-400 hover:text-indigo-300 mr-3 disabled:opacity-50"
								>
									{updatingRoleId === user._id ? "Updating..." : "Toggle Role"}
								</button>
								<button
									onClick={() => handleDeleteUser(user._id)}
									disabled={deletingId === user._id}
									className="text-red-400 hover:text-red-300 disabled:opacity-50"
								>
									{deletingId === user._id ? (
										"Deleting..."
									) : (
										<Trash2 className="w-4 h-4" />
									)}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default UsersList;
